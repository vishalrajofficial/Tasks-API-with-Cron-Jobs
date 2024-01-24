// Calculate task priority based on due date
const getPriority = (due_date) => {
    const today = new Date();
    const dueDate = new Date(due_date);
    const diffTime = Math.abs(dueDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 0; 
    if (diffDays <= 2) return 1;
    if (diffDays <= 4) return 2;
    return 3;
}

module.exports = {
    getPriority,
}