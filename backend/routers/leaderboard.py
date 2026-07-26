from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import LeaderboardResponse, LeaderboardUser

router = APIRouter()

DEFAULT_USER_ID = 1


@router.get("/leaderboard", response_model=LeaderboardResponse)
def get_leaderboard(db: Session = Depends(get_db)) -> LeaderboardResponse:
    users = db.query(User).order_by(User.xp.desc()).all()

    current_user_rank = 1
    leaderboard: list[LeaderboardUser] = []

    for i, user in enumerate(users):
        rank = i + 1
        if user.id == DEFAULT_USER_ID:
            current_user_rank = rank

        leaderboard.append(
            LeaderboardUser(
                id=user.id,
                display_name=user.display_name,
                xp=user.xp,
                rank=rank,
            )
        )

    return LeaderboardResponse(
        leaderboard=leaderboard,
        current_user_rank=current_user_rank,
    )


@router.post("/practice/refill")
def refill_hearts(db: Session = Depends(get_db)) -> dict[str, int]:
    user = db.query(User).get(DEFAULT_USER_ID)
    user.hearts = 5
    db.commit()
    return {"hearts": user.hearts}
