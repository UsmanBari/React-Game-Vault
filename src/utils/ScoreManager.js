const ScoreManager = {
    getHighScores: () => {
        const scores = localStorage.getItem('nexus_scores');
        return scores ? JSON.parse(scores) : { hangman: 0, wordle: 0, snake: 0, memory: 0 };
    },

    saveScore: (gameId, score) => {
        const scores = ScoreManager.getHighScores();
        if (score > (scores[gameId] || 0)) {
            scores[gameId] = score;
            localStorage.setItem('nexus_scores', JSON.stringify(scores));
            return true; // New high score
        }
        return false;
    }
};

export default ScoreManager;
