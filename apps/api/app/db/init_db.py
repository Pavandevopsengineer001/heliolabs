from sqlmodel import SQLModel

from app.core.config import settings
from app.db.session import engine
from app.models import *  # noqa: F403
from app.utils.seed import seed_data


def init_db() -> None:
    SQLModel.metadata.create_all(engine)

    if not settings.auto_seed:
        return

    from sqlmodel import Session

    with Session(engine) as session:
        seed_data(session)
