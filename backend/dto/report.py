import uuid
from datetime import date
from dataclasses import dataclass
from enum import Enum


class DocumentType(Enum):
    TEXT = 'text'
    PICTURE = 'picture'
    AUDIO = 'audio'
    FILE = 'file'


@dataclass
class Document:
    id: uuid.UUID
    type: DocumentType
    content: str


@dataclass
class Activity:
    id: uuid.UUID
    activity_name: str
    description: str
    date: date
    documents: [Document]


@dataclass
class Report:
    id: uuid.UUID
    description: str
    success: bool
    project_name: str
    created_at: date
    owner: str
    collaborators: [str]
    activities: [Activity]

