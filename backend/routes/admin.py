import os
import re
import uuid
from pathlib import Path

from flask import Blueprint, current_app, jsonify, request
from werkzeug.utils import secure_filename

from auth import admin_required, create_token, current_user
from extensions import db
from models import AdminUser, Enquiry, MediaAsset, Property, SiteSection

admin_bp = Blueprint("admin", __name__, url_prefix="/api")

# ----------------------------------------------------------------- auth


@admin_bp.post("/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = AdminUser.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({"token": create_token(user), "user": user.to_dict()})


@admin_bp.get("/auth/me")
@admin_required
def me():
    return jsonify(current_user().to_dict())


# ----------------------------------------------------------- dashboard


@admin_bp.get("/admin/stats")
@admin_required
def stats():
    return jsonify(
        {
            "properties": Property.query.count(),
            "published": Property.query.filter_by(published=True).count(),
            "featured": Property.query.filter_by(featured=True).count(),
            "enquiries": Enquiry.query.count(),
            "newEnquiries": Enquiry.query.filter_by(status="new").count(),
            "media": MediaAsset.query.count(),
            "posts": __import__("models").BlogPost.query.count(),
            "recentEnquiries": [
                e.to_dict()
                for e in Enquiry.query.order_by(Enquiry.created_at.desc()).limit(5).all()
            ],
        }
    )


# ---------------------------------------------------------- properties


def slugify(value: str) -> str:
    value = re.sub(r"[^a-zA-Z0-9\s-]", "", value or "").strip().lower()
    return re.sub(r"[\s_-]+", "-", value) or uuid.uuid4().hex[:8]


def unique_slug(base: str, ignore_id=None) -> str:
    slug = slugify(base)
    candidate, i = slug, 2
    while True:
        q = Property.query.filter_by(slug=candidate)
        if ignore_id:
            q = q.filter(Property.id != ignore_id)
        if not q.first():
            return candidate
        candidate = f"{slug}-{i}"
        i += 1


FIELDS = [
    ("name", "name"),
    ("tagline", "tagline"),
    ("type", "type"),
    ("status", "status"),
    ("location", "location"),
    ("beds", "beds"),
    ("baths", "baths"),
    ("size", "size"),
    ("plot", "plot"),
    ("shortDesc", "short_desc"),
    ("heroImage", "hero_image"),
    ("cardImage", "card_image"),
]
LIST_FIELDS = [
    ("description", "description"),
    ("highlights", "highlights"),
    ("amenities", "amenities"),
    ("gallery", "gallery"),
]


def apply_payload(prop: Property, data: dict) -> None:
    for src, attr in FIELDS:
        if src in data:
            setattr(prop, attr, data.get(src) or "")
    for src, attr in LIST_FIELDS:
        if src in data:
            value = data.get(src) or []
            if isinstance(value, str):
                value = [ln.strip() for ln in value.splitlines() if ln.strip()]
            setattr(prop, attr, value)
    if "priceFrom" in data:
        raw = data.get("priceFrom")
        prop.price_from = int(raw) if raw not in (None, "", "null") else None
    if "featured" in data:
        prop.featured = bool(data.get("featured"))
    if "published" in data:
        prop.published = bool(data.get("published"))


@admin_bp.get("/admin/properties")
@admin_required
def admin_list_properties():
    items = Property.query.order_by(Property.created_at.desc()).all()
    return jsonify([p.to_dict() for p in items])


@admin_bp.get("/admin/properties/<int:pid>")
@admin_required
def admin_get_property(pid):
    prop = Property.query.get_or_404(pid)
    return jsonify(prop.to_dict())


@admin_bp.post("/admin/properties")
@admin_required
def admin_create_property():
    data = request.get_json(silent=True) or {}
    if not (data.get("name") or "").strip():
        return jsonify({"errors": {"name": "Name is required"}}), 400

    prop = Property()
    apply_payload(prop, data)
    prop.slug = unique_slug(data.get("slug") or data.get("name"))
    db.session.add(prop)
    db.session.commit()
    return jsonify(prop.to_dict()), 201


@admin_bp.put("/admin/properties/<int:pid>")
@admin_required
def admin_update_property(pid):
    prop = Property.query.get_or_404(pid)
    data = request.get_json(silent=True) or {}
    apply_payload(prop, data)
    if data.get("slug"):
        prop.slug = unique_slug(data["slug"], ignore_id=prop.id)
    db.session.commit()
    return jsonify(prop.to_dict())


@admin_bp.delete("/admin/properties/<int:pid>")
@admin_required
def admin_delete_property(pid):
    prop = Property.query.get_or_404(pid)
    db.session.delete(prop)
    db.session.commit()
    return jsonify({"ok": True})


# ------------------------------------------------------------ enquiries


@admin_bp.get("/admin/enquiries")
@admin_required
def admin_list_enquiries():
    query = Enquiry.query
    status = request.args.get("status")
    if status and status != "all":
        query = query.filter_by(status=status)
    items = query.order_by(Enquiry.created_at.desc()).all()
    return jsonify([e.to_dict() for e in items])


@admin_bp.patch("/admin/enquiries/<int:eid>")
@admin_required
def admin_update_enquiry(eid):
    enquiry = Enquiry.query.get_or_404(eid)
    data = request.get_json(silent=True) or {}
    if data.get("status") in ("new", "contacted", "closed"):
        enquiry.status = data["status"]
    db.session.commit()
    return jsonify(enquiry.to_dict())


@admin_bp.delete("/admin/enquiries/<int:eid>")
@admin_required
def admin_delete_enquiry(eid):
    enquiry = Enquiry.query.get_or_404(eid)
    db.session.delete(enquiry)
    db.session.commit()
    return jsonify({"ok": True})


# ---------------------------------------------------------------- media


def allowed_file(filename: str) -> bool:
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in current_app.config["ALLOWED_EXTENSIONS"]
    )


@admin_bp.get("/admin/media")
@admin_required
def admin_list_media():
    items = MediaAsset.query.order_by(MediaAsset.created_at.desc()).all()
    return jsonify([m.to_dict() for m in items])


@admin_bp.post("/admin/media")
@admin_required
def admin_upload_media():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "No file selected"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file type"}), 400

    upload_dir: Path = current_app.config["UPLOAD_DIR"]
    upload_dir.mkdir(parents=True, exist_ok=True)

    original = secure_filename(file.filename)
    ext = original.rsplit(".", 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    path = upload_dir / filename
    file.save(path)

    asset = MediaAsset(
        filename=filename,
        original_name=original,
        url=f"{current_app.config['UPLOAD_URL_PREFIX']}/{filename}",
        mimetype=file.mimetype or "",
        size=path.stat().st_size,
        alt=request.form.get("alt", ""),
    )
    db.session.add(asset)
    db.session.commit()
    return jsonify(asset.to_dict()), 201


@admin_bp.delete("/admin/media/<int:mid>")
@admin_required
def admin_delete_media(mid):
    asset = MediaAsset.query.get_or_404(mid)
    path: Path = current_app.config["UPLOAD_DIR"] / asset.filename
    try:
        if path.exists():
            os.remove(path)
    except OSError:
        pass
    db.session.delete(asset)
    db.session.commit()
    return jsonify({"ok": True})


# -------------------------------------------------------------- sections


@admin_bp.get("/admin/sections")
@admin_required
def admin_list_sections():
    items = SiteSection.query.order_by(SiteSection.page, SiteSection.id).all()
    return jsonify([s.to_dict() for s in items])


@admin_bp.get("/admin/sections/<key>")
@admin_required
def admin_get_section(key):
    section = SiteSection.query.filter_by(key=key).first_or_404()
    return jsonify(section.to_dict())


@admin_bp.put("/admin/sections/<key>")
@admin_required
def admin_update_section(key):
    section = SiteSection.query.filter_by(key=key).first_or_404()
    data = request.get_json(silent=True) or {}
    content = data.get("content")
    if not isinstance(content, dict):
        return jsonify({"error": "content must be an object"}), 400
    section.content = content
    db.session.commit()
    return jsonify(section.to_dict())


# ----------------------------------------------------------------- blog

from models import BlogPost  # noqa: E402

POST_FIELDS = [
    ("title", "title"), ("excerpt", "excerpt"), ("category", "category"),
    ("author", "author"), ("readTime", "read_time"), ("coverImage", "cover_image"),
]


def unique_post_slug(base: str, ignore_id=None) -> str:
    slug = slugify(base)
    candidate, i = slug, 2
    while True:
        q = BlogPost.query.filter_by(slug=candidate)
        if ignore_id:
            q = q.filter(BlogPost.id != ignore_id)
        if not q.first():
            return candidate
        candidate = f"{slug}-{i}"
        i += 1


def apply_post(post: BlogPost, data: dict) -> None:
    for src, attr in POST_FIELDS:
        if src in data:
            setattr(post, attr, data.get(src) or "")
    if "tags" in data:
        tags = data.get("tags") or []
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(",") if t.strip()]
        post.tags = tags
    if "body" in data:
        body = data.get("body") or []
        if isinstance(body, str):
            body = [
                {"type": "paragraph", "text": ln.strip()}
                for ln in body.split("\n")
                if ln.strip()
            ]
        post.body = body
    if "published" in data:
        post.published = bool(data.get("published"))
    if "featured" in data:
        post.featured = bool(data.get("featured"))


@admin_bp.get("/admin/posts")
@admin_required
def admin_list_posts():
    items = BlogPost.query.order_by(BlogPost.published_at.desc()).all()
    return jsonify([p.to_dict() for p in items])


@admin_bp.post("/admin/posts")
@admin_required
def admin_create_post():
    data = request.get_json(silent=True) or {}
    if not (data.get("title") or "").strip():
        return jsonify({"errors": {"title": "Title is required"}}), 400
    post = BlogPost()
    apply_post(post, data)
    post.slug = unique_post_slug(data.get("slug") or data.get("title"))
    db.session.add(post)
    db.session.commit()
    return jsonify(post.to_dict()), 201


@admin_bp.put("/admin/posts/<int:pid>")
@admin_required
def admin_update_post(pid):
    post = BlogPost.query.get_or_404(pid)
    data = request.get_json(silent=True) or {}
    apply_post(post, data)
    if data.get("slug"):
        post.slug = unique_post_slug(data["slug"], ignore_id=post.id)
    db.session.commit()
    return jsonify(post.to_dict())


@admin_bp.delete("/admin/posts/<int:pid>")
@admin_required
def admin_delete_post(pid):
    post = BlogPost.query.get_or_404(pid)
    db.session.delete(post)
    db.session.commit()
    return jsonify({"ok": True})
