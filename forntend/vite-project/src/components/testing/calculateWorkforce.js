export const calculatePercentageWorking = (workingToday, totalEmployees) => {
  const totalWorkforce = totalEmployees;
  const percentageWorking = totalWorkforce
    ? ((workingToday / totalWorkforce) * 100).toFixed(0)
    : 0;
  return Number(percentageWorking);
};
