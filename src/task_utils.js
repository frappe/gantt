export default {
    find_task_overlaps(tasks) {
        const overlaps = [];

        const sortedTasks = [...tasks].sort((a, b) => a.start - b.start);

        for (let i = 0; i < sortedTasks.length; i++) {
            for (let j = i + 1; j < sortedTasks.length; j++) {
                const nextInterval = sortedTasks[j];
                const currentIntreval = sortedTasks[i];

                if (nextInterval.start > currentIntreval.end) {
                    break;
                }

                if (
                    currentIntreval.start <= nextInterval.end &&
                    nextInterval.start <= currentIntreval.end
                ) {
                    const start = Math.max(
                        currentIntreval.start,
                        nextInterval.start,
                    );
                    const end = Math.min(currentIntreval.end, nextInterval.end);
                    overlaps.push({
                        task1: currentIntreval,
                        task2: nextInterval,
                        start,
                        end,
                        duration: end - start,
                    });
                }
            }
        }

        return overlaps;
    },
};
