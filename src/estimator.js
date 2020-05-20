const impact = {};
const severalImpact = {};
const currentlyInfectedEstimate = (data) => {
    const {reportedCases, periodType} = data;
    let {timeToElapse} = data;
    if (periodType === 'weeks') {
        timeToElapse *= 7;
    }
    if (periodType === 'months') {
        timeToElapse *= 30;    
    }
    data.timeToElapse = timeToElapse;
    const powerFactor = Math.trunc(timeToElapse / 3);
    impact.currentInfected = reportedCases * 10;
    impact.infectionByRequestedTime = Math.trunc(impact.currentInfected * (2 ** powerFactor));
    severeImpact.currentInfected = reportedCases * 50;
    severalImpact.infectionByRequestedTime = Math.trunc(severalImpact.currentInfected * (2 ** powerFactor));  
};
const severeCasesByRequestedTime = (data) => {
    const { timeToElapse } = data;
    const powerFactor = Math.trunc(timeToElapse / 3);
    impact.severeCasesByRequestedTime = Math.trunc((15 / 100) * impact.currentInfected * (2 ** powerFactor));
    severeImpact.severeCasesByRequestedTime = Math.trunc((15 / 100) * severalImpact.currentInfected * (2 ** powerFactor)); 
};
const hospitalBedsByRequestedTime = (data) => {
    const {totalHospitalBeds} = data;
    const availableBeds = (35 / 100) * totalHospitalBeds;
    impact.hospitalBedsByRequestedTime = Math.trunc(availableBeds - impact.severeCasesByRequestedTime);
    severalImpact.hospitalBedsByRequestedTime = Math.trunc(availableBeds - severalImpact.severeCasesByRequestedTime);
};
const casesForICUByRequestedTime = () => {
    impact.casesForICUByRequestedTime = Math.trunc(impact.infectionByRequestedTime * (5 / 100));
    severalImpact.casesForICUByRequestedTime = Math.trunc(severalImpact.infectionByRequestedTime * (5 / 100));
};
const caseaForVentilatorByRequestedTime = () => {
    impact.caseaForVentilatorByRequestedTime = Math.trunc(impact.infectionByRequestedTime * (2 / 100));
    severalImpact.caseaForVentilatorByRequestedTime = Math.trunc(severalImpact.infectionByRequestedTime * (2 / 100));
};
const dollarInFlight = (data) => {
    const {region} = data;
    const {timeToElapse} = data;
    impact.dollarInFlight = Math.trunc((impact.infectionByRequestedTime * region.avrgDailyIncomePopulation * region.avrgDailyIncomeInUSD) / timeToElapse);
    severalImpact.dollarInFlight = Math.trunc((severalImpact.infectionByRequestedTime * region.avrgDailyIncomePopulation * region.avrgDailyIncomeInUSD) / timeToElapse);
};
const covid19ImpactEstimator = (data) => {
    const estimator = () => {
        currentlyInfectedEstimate(data);
        severeCasesByRequestedTime(data);
        hospitalBedsByRequestedTime(data);
        casesForICUByRequestedTime(data);
        caseaForVentilatorByRequestedTime();
        dollarInFlight(data);
    };
    estimator(data);
    return({
        data,
        impact,
        severeImpact
    });
};
export default covid19ImpactEstimator;
