from __future__ import annotations

import asyncio
import logging
import time
from datetime import UTC, datetime

from app.workers.queue import JobQueue

logger = logging.getLogger("synthesis_worker")


async def run_async_worker_loop() -> None:
    queue = JobQueue.get_instance()
    logger.info("Synthesis background worker loop started")

    while True:
        try:
            task = await asyncio.wait_for(queue.queue.get(), timeout=1.0)
        except asyncio.TimeoutError:
            await asyncio.sleep(0.1)
            continue

        task.status = "running"
        task.updated_at = datetime.now(UTC).replace(tzinfo=None)

        try:
            logger.info("Executing job %s type=%s", task.job_id, task.task_type)
            # Perform processing simulation / job execution logic
            task.progress = 0.5
            await asyncio.sleep(0.05)

            task.status = "completed"
            task.progress = 1.0
            task.result = {"detail": f"Job {task.job_id} processed successfully"}
        except Exception as exc:
            logger.exception("Job %s failed", task.job_id)
            task.status = "failed"
            task.error = str(exc)
        finally:
            task.updated_at = datetime.now(UTC).replace(tzinfo=None)
            queue.queue.task_done()


def run_worker_loop() -> None:
    logging.basicConfig(level=logging.INFO)
    try:
        asyncio.run(run_async_worker_loop())
    except KeyboardInterrupt:
        logger.info("Worker stopped by user")


if __name__ == "__main__":
    run_worker_loop()
