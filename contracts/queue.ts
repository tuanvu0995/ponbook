declare module '@ioc:Queue' {
  import type { ConnectionOptions, WorkerOptions, QueueOptions, JobsOptions, Job } from 'bullmq'

  export type DataForJob<K extends string> = K extends keyof JobsList
    ? JobsList[K]
    : Record<string, unknown>

  export type DispatchOptions = JobsOptions & {
    queueName?: 'default' | string
  }

  export type QueueConfig = {
    connection: ConnectionOptions
    queue: QueueOptions
    worker: WorkerOptions
    jobs: JobsOptions
  }

  export interface JobHandlerContract {
    handle(payload: any): Promise<void>
    failed(): Promise<void>
  }

  /**
   * An interface to define typed queues/jobs
   */
  export interface JobsList {}

  import BullManager from 'providers/Queue/Queue'

  export const Queue: BullManager

  export { Job }
}
