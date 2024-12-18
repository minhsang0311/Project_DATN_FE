import '../../styles/pages/statistics.css';
import StatisticsOrderStatus from './StatisticsOrderStatus';
import StatisticsPro from './StatisticsPro';
import StatisticsRevenue from './StatisticsRevenue';
import StatisticsSalePro from './StatisticsSalePro';
// import StatisticsUser from './StatisticsUser';
const Statistics = () => {
    return (
        <div className='container-statistics'>
            <StatisticsPro/>
            <StatisticsOrderStatus/>
            <StatisticsRevenue/>
            <StatisticsSalePro/>
            {/* <StatisticsUser/> */}
        </div>
    );
};

export default Statistics;
