/**
 * Spaced Repetition Algorithm (based on SuperMemo 2)
 * 
 * @param {number} rating - User rating (0=Again, 1=Hard, 2=Good, 3=Easy)
 * @param {number} currentInterval - Current interval in days
 * @param {number} currentEase - Current ease factor
 * @param {number} repetitions - Current consecutive correct repetitions
 * @returns {object} - { interval, easeFactor, repetitions }
 */
const calculateNextReview = (rating, currentInterval, currentEase, repetitions) => {
    let nextInterval;
    let nextEase = currentEase;
    let nextRepetitions = repetitions;

    // Mapping frontend ratings to a conceptual "quality" for SM-2 (0-5 scale)
    // Frontend: 0=Again, 1=Hard, 2=Good, 3=Easy
    // SM-2: <3 is specific failure, >=3 is pass.
    // Let's map:
    // 0 (Again) -> 0 (Complete blackout)
    // 1 (Hard)  -> 3 (Pass with difficulty)
    // 2 (Good)  -> 4 (Pass with hesitation)
    // 3 (Easy)  -> 5 (Perfect)

    let quality = 0;
    if (rating === 0) quality = 0;
    else if (rating === 1) quality = 3;
    else if (rating === 2) quality = 4;
    else if (rating === 3) quality = 5;

    if (quality >= 3) {
        // Correct response
        if (repetitions === 0) {
            nextInterval = 1;
        } else if (repetitions === 1) {
            nextInterval = 6;
        } else {
            nextInterval = Math.round(currentInterval * currentEase);
        }
        nextRepetitions += 1;
    } else {
        // Incorrect response (Again)
        nextRepetitions = 0;
        nextInterval = 1;
    }

    // Update Ease Factor
    // Formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    // Min EF is 1.3
    nextEase = currentEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (nextEase < 1.3) nextEase = 1.3;

    return {
        interval: nextInterval,
        easeFactor: nextEase,
        repetitions: nextRepetitions
    };
};

module.exports = { calculateNextReview };
