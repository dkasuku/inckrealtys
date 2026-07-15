from datetime import datetime, timezone

from sqlalchemy import JSON
from werkzeug.security import check_password_hash, generate_password_hash

from extensions import db


def utcnow():
    return datetime.now(timezone.utc)


class AdminUser(db.Model):
    __tablename__ = "admin_users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    name = db.Column(db.String(120), default="Administrator")
    password_hash = db.Column(db.String(512), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow)

    def set_password(self, raw: str) -> None:
        self.password_hash = generate_password_hash(raw)

    def check_password(self, raw: str) -> bool:
        return check_password_hash(self.password_hash, raw)

    def to_dict(self):
        return {"id": self.id, "email": self.email, "name": self.name}


class Property(db.Model):
    __tablename__ = "properties"

    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(180), unique=True, nullable=False, index=True)
    name = db.Column(db.String(180), nullable=False)
    tagline = db.Column(db.String(255), default="")
    type = db.Column(db.String(60), default="Apartments")
    status = db.Column(db.String(40), default="Selling")
    location = db.Column(db.String(180), default="")
    price_from = db.Column(db.BigInteger, nullable=True)  # KES; null = on request
    beds = db.Column(db.String(80), default="")
    baths = db.Column(db.String(80), default="")
    size = db.Column(db.String(80), default="")
    plot = db.Column(db.String(80), default="")
    featured = db.Column(db.Boolean, default=False)
    published = db.Column(db.Boolean, default=True)
    short_desc = db.Column(db.Text, default="")
    description = db.Column(JSON, default=list)   # list[str] paragraphs
    highlights = db.Column(JSON, default=list)    # list[str]
    amenities = db.Column(JSON, default=list)     # list[str]
    hero_image = db.Column(db.Text, default="")
    card_image = db.Column(db.Text, default="")
    gallery = db.Column(JSON, default=list)       # list[str] urls
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "slug": self.slug,
            "name": self.name,
            "tagline": self.tagline,
            "type": self.type,
            "status": self.status,
            "location": self.location,
            "priceFrom": self.price_from,
            "beds": self.beds,
            "baths": self.baths,
            "size": self.size,
            "plot": self.plot,
            "featured": bool(self.featured),
            "published": bool(self.published),
            "shortDesc": self.short_desc,
            "description": self.description or [],
            "highlights": self.highlights or [],
            "amenities": self.amenities or [],
            "heroImage": self.hero_image,
            "cardImage": self.card_image,
            "gallery": self.gallery or [],
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


class Enquiry(db.Model):
    """A contact/viewing request submitted from the public site."""

    __tablename__ = "enquiries"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(160), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(60), default="")
    subject = db.Column(db.String(255), default="")
    message = db.Column(db.Text, default="")
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id"), nullable=True)
    property_slug = db.Column(db.String(180), default="")
    status = db.Column(db.String(30), default="new")  # new | contacted | closed
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow)

    property = db.relationship("Property", backref="enquiries")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "subject": self.subject,
            "message": self.message,
            "propertyId": self.property_id,
            "propertySlug": self.property_slug,
            "propertyName": self.property.name if self.property else None,
            "status": self.status,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


class MediaAsset(db.Model):
    __tablename__ = "media_assets"

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_name = db.Column(db.String(255), default="")
    url = db.Column(db.Text, nullable=False)
    mimetype = db.Column(db.String(80), default="")
    size = db.Column(db.Integer, default=0)
    alt = db.Column(db.String(255), default="")
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "originalName": self.original_name,
            "url": self.url,
            "mimetype": self.mimetype,
            "size": self.size,
            "alt": self.alt,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


class SiteSection(db.Model):
    """Editable content for any section of the public site.

    `key` identifies the section (e.g. 'hero', 'stats', 'vision_mission').
    `content` holds an arbitrary JSON blob matching that section's shape.
    """

    __tablename__ = "site_sections"

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(80), unique=True, nullable=False, index=True)
    label = db.Column(db.String(160), default="")
    page = db.Column(db.String(60), default="home")
    content = db.Column(JSON, default=dict)
    updated_at = db.Column(db.DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "key": self.key,
            "label": self.label,
            "page": self.page,
            "content": self.content or {},
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }


class BlogPost(db.Model):
    __tablename__ = "blog_posts"

    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(200), unique=True, nullable=False, index=True)
    title = db.Column(db.String(220), nullable=False)
    excerpt = db.Column(db.Text, default="")
    category = db.Column(db.String(80), default="Insights")
    author = db.Column(db.String(120), default="INCK Realty")
    read_time = db.Column(db.String(30), default="5 min read")
    cover_image = db.Column(db.Text, default="")
    published = db.Column(db.Boolean, default=True)
    featured = db.Column(db.Boolean, default=False)
    tags = db.Column(JSON, default=list)      # list[str]
    body = db.Column(JSON, default=list)      # list of blocks: {type, text} | {type:'image', src, caption}
    published_at = db.Column(db.DateTime(timezone=True), default=utcnow)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "slug": self.slug,
            "title": self.title,
            "excerpt": self.excerpt,
            "category": self.category,
            "author": self.author,
            "readTime": self.read_time,
            "coverImage": self.cover_image,
            "published": bool(self.published),
            "featured": bool(self.featured),
            "tags": self.tags or [],
            "body": self.body or [],
            "publishedAt": self.published_at.isoformat() if self.published_at else None,
        }
