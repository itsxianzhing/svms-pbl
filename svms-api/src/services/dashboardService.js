import dashboardRepository from '../repositories/dashboardRepository.js';

const getSummary = async () => {
    return await dashboardRepository.getSummary();
};

export default {
    getSummary
};