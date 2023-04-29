import uuid
from datetime import date
from dataclasses import dataclass


@dataclass
class Activity:
    id: uuid.UUID
    name: str
    description: str
    date: date


@dataclass
class Report:
    id: uuid.UUID
    project_name: str
    created_at: date
    owner: str
    collaborators: [str]
    activities: [Activity]

