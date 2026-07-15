import re

from flask import Blueprint, jsonify, request

from extensions import db
from models import Enquiry, Property, SiteSection

public_bp = Blueprint("public", __name__, url_prefix="/api")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@public_bp.get("/health")
def health():
    return jsonify({"status": "ok"})


@public_bp.get("/properties")
def list_properties():
    query = Property.query.filter_by(published=True)

    ptype = request.args.get("type")
    status = request.args.get("status")
    featured = request.args.get("featured")

    if ptype and ptype != "All":
        query = query.filter_by(type=ptype)
    if status and status != "All":
        query = query.filter_by(status=status)
    if featured in ("1", "true", "True"):
        query = query.filter_by(featured=True)

    items = query.order_by(Property.created_at.desc()).all()
    return jsonify([p.to_dict() for p in items])


@public_bp.get("/properties/<slug>")
def get_property(slug):
    prop = Property.query.filter_by(slug=slug, published=True).first()
    if not prop:
        return jsonify({"error": "Not found"}), 404
    return jsonify(prop.to_dict())


@public_bp.get("/sections")
def list_sections():
    """Return all site content keyed by section key."""
    sections = SiteSection.query.all()
    return jsonify({s.key: s.content or {} for s in sections})


@public_bp.get("/sections/<key>")
def get_section(key):
    section = SiteSection.query.filter_by(key=key).first()
    if not section:
        return jsonify({"error": "Not found"}), 404
    return jsonify(section.to_dict())


@public_bp.post("/enquiries")
def create_enquiry():
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()

    errors = {}
    if not name:
        errors["name"] = "Name is required"
    if not email or not EMAIL_RE.match(email):
        errors["email"] = "A valid email is required"
    if not message:
        errors["message"] = "Message is required"
    if errors:
        return jsonify({"errors": errors}), 400

    slug = (data.get("propertySlug") or "").strip()
    prop = Property.query.filter_by(slug=slug).first() if slug else None

    enquiry = Enquiry(
        name=name,
        email=email,
        phone=(data.get("phone") or "").strip(),
        subject=(data.get("subject") or "").strip(),
        message=message,
        property_id=prop.id if prop else None,
        property_slug=slug,
    )
    db.session.add(enquiry)
    db.session.commit()

    return jsonify({"ok": True, "id": enquiry.id}), 201


@public_bp.get("/posts")
def list_posts():
    from models import BlogPost

    query = BlogPost.query.filter_by(published=True)
    category = request.args.get("category")
    if category and category != "All":
        query = query.filter_by(category=category)
    items = query.order_by(BlogPost.published_at.desc()).all()
    return jsonify([p.to_dict() for p in items])


@public_bp.get("/posts/<slug>")
def get_post(slug):
    from models import BlogPost

    post = BlogPost.query.filter_by(slug=slug, published=True).first()
    if not post:
        return jsonify({"error": "Not found"}), 404
    return jsonify(post.to_dict())
