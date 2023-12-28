const dashboardNASDAQChart = {
  data: (canvas) => {
    return {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      datasets: [
        {
          label: 'الفواكة',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          fill: false,
          borderColor: '#fbc658',
          backgroundColor: 'transparent',
          pointBorderColor: '#fbc658',
          pointRadius: 4,
          pointHoverRadius: 4,
          pointBorderWidth: 8,
          tension: 0.4,
        },
        {
          label: 'الخضراوات',
          data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          fill: false,
          borderColor: '#51CACF',
          backgroundColor: 'transparent',
          pointBorderColor: '#51CACF',
          pointRadius: 4,
          pointHoverRadius: 4,
          pointBorderWidth: 8,
          tension: 0.4,
        },
      ],
    };
  },
  options: {
    plugins: {
      legend: { display: true },
    },
  },
};

module.exports = {
  dashboardNASDAQChart,
};
