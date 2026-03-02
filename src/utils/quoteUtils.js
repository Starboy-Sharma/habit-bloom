const quotes = [
    { text: "Small steps every day lead to big results.", author: "Anonymous" },
    { text: "Discipline is choosing between what you want now and what you want most.", author: "Augusta F. Kantra" },
    { text: "We are what we repeatedly do. Excellence is not an act, but a habit.", author: "Aristotle" },
    { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "You don't rise to the level of your goals, you fall to the level of your systems.", author: "James Clear" },
    { text: "Motivation gets you started. Habit keeps you going.", author: "Jim Ryun" },
    { text: "The pain of discipline is far less than the pain of regret.", author: "Sarah Bombell" },
    { text: "Each day is a new chance to grow and improve.", author: "Anonymous" },
    { text: "Progress, not perfection.", author: "Anonymous" },
    { text: "Build the habit, and the habit will build you.", author: "Anonymous" },
    { text: "Your habits today determine your success tomorrow.", author: "Anonymous" },
    { text: "Consistency is the key that unlocks extraordinary results.", author: "Anonymous" },
    { text: "Every expert was once a beginner. Keep going!", author: "Anonymous" },
];

export const getDailyQuote = () => {
    const dayOfYear = Math.floor(
        (new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );
    return quotes[dayOfYear % quotes.length];
};

export const getAllQuotes = () => quotes;
