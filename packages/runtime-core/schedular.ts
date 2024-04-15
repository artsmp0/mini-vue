export interface SchedulerJob extends Function {
  id?: number;
}

const queue: SchedulerJob[] = [];

let flushIndex = 0;

let isFlushing = false;
let isFlushPending = false;

const resolvedPromise = Promise.resolve() as Promise<any>;
let currentFlushPromise: Promise<any> | null = null;

export function nextTick<T = void>(
  this: T,
  fn?: (this: T) => void
): Promise<void> {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(this ? fn.bind(this) : fn) : p;
}

export function queueJob(job: SchedulerJob) {
  if (!queue.length || !queue.includes(job, isFlushing ? flushIndex + 1 : 0)) {
    if (job.id === null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id!), 0, job);
    }
    // console.log("queue: ", queue);
    queueFlush();
  }
}

function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(() => {
      isFlushPending = false;
      isFlushing = true;
      queue.forEach((job) => {
        job();
      });

      flushIndex = 0;
      queue.length = 0;
      isFlushing = false;
      currentFlushPromise = null;
    });
  }
}

function findInsertionIndex(id: number) {
  let start = flushIndex + 1;
  let end = queue.length;

  // 使用二分查找，效率更高
  while (start < end) {
    // 无符号右移，相当于除以二并取整
    const middle = (start + end) >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? (start = middle + 1) : (end = middle);
  }

  return start;
}

const getId = (job: SchedulerJob): number =>
  job.id == null ? Infinity : job.id;
