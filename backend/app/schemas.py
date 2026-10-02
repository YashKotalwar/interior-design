from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class PhotoOut(BaseModel):
    id: int
    url: str
    sort_order: int
    is_cover: bool


class ProjectOut(BaseModel):
    id: int
    slug: str
    title: str
    location: str
    year: int
    category: str
    description: str
    featured: bool
    is_hero: bool = False
    visual_key: Optional[str] = None
    cover_url: Optional[str] = None
    photos: List[PhotoOut] = []


class ProjectList(BaseModel):
    items: List[ProjectOut]


class ProjectIn(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    slug: Optional[str] = None
    location: str = Field(min_length=1, max_length=120)
    year: int = Field(ge=1980, le=2100)
    category: str
    description: str = Field(min_length=1, max_length=8000)
    featured: bool = False
    is_hero: bool = False
    visual_key: Optional[str] = None


class ProjectPatch(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=120)
    slug: Optional[str] = None
    location: Optional[str] = Field(default=None, min_length=1, max_length=120)
    year: Optional[int] = Field(default=None, ge=1980, le=2100)
    category: Optional[str] = None
    description: Optional[str] = Field(default=None, min_length=1, max_length=8000)
    featured: Optional[bool] = None
    is_hero: Optional[bool] = None
    visual_key: Optional[str] = None


class PhotoPatch(BaseModel):
    is_cover: Optional[bool] = None
    sort_order: Optional[int] = None


class LoginIn(BaseModel):
    username: str
    password: str


class InquiryIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    message: str = Field(min_length=1, max_length=4000)


class InquiryOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    created_at: str


class InquiryList(BaseModel):
    items: List[InquiryOut]


class SearchHit(BaseModel):
    slug: str
    title: str
    location: str
    category: str
    type: str = "project"


class SearchResults(BaseModel):
    items: List[SearchHit]


class Ok(BaseModel):
    ok: bool = True
    message: Optional[str] = None
