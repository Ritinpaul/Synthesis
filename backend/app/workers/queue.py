from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any, Callable, Coroutine
from uuid import uuid4


@dataclass
class JobTask:
    job_id: str
    task_type: str  # "index_repo" | "analyze_pr" | "batch_query"
    payload: dict[str, Any]
    status: str = "queued"  # "queued" | "running" | "completed" | "failed"
    progress: float = 0.0
    result: dict[str, Any] | None = None
    error: str | None = None
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC).replace(tzinfo=None))
    updated_at: datetime = field(default_factory=lambda: datetime.now(UTC).replace(tzinfo=None))


class JobQueue:
    _instance: JobQueue | None = None

    def __init__(self) -> None:
        self.jobs: dict[str, JobTask] = {}
        self.queue: asyncio.Queue[JobTask] = asyncio.Queue()

    @classmethod
    def get_instance(cls) -> JobQueue:
        if cls._instance is None:
            cls._instance = JobQueue()
        return cls._instance

    def enqueue(self, task_type: str, payload: dict[str, Any]) -> JobTask:
        job_id = f"job-{uuid4().hex[:12]}"
        task = JobTask(job_id=job_id, task_type=task_type, payload=payload)
        self.jobs[job_id] = task
        try:
            self.queue.put_nowait(task)
        except Exception:
            pass
        return task

    def get_job(self, job_id: str) -> JobTask | None:
        return self.jobs.get(job_id)


def enqueue_background_job(task_type: str, payload: dict[str, Any]) -> JobTask:
    return JobQueue.get_instance().enqueue(task_type, payload)
