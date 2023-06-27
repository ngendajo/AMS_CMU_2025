
import './admin.css';
import { BsDot } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import Item from "../components/charts/Item";

const Admin = () => {
  const data = [5, 2, 5, 5, 10],
    subTitle1 = "1241",
    showLabel = false,
    colors = ["#F49D47","#42A2EC", "#F9DF5A", "#FF7410", "#4C8061"],
    radius = 45,
    hole = 30,
    stroke = 1,
    strokeWidth = 10;
  return (
    <div className="dashboard-container">
        <div className="statistic-part">
          <div className="statistic-part-left statistic">
            <div className='alumni-statistics-title'>
              <h2>Total Alumni</h2>
            </div>
            <div className='alumni-statistics-body'>
                <div className="item">
                  <Item
                    data={data}
                    subTitle1={subTitle1}
                    colors={colors}
                    radius={radius}
                    hole={hole}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    showLabel={showLabel}
                  />
                </div>
                <div className='item2'>
                  <div className='item2-title'>Alumni</div>
                  <div className='item2-body'><h2><AiOutlinePlus className='item2-icon'/></h2><h2 className='alumni-number'>1241</h2></div>
                  <div className='item2-title'>10 Grades</div>
                </div>
                <div className='itme3'>
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>Male</div>
                      <div className='male-statistics'><strong className='male-number'>800</strong><span className='male-percentage'>40%</span></div>
                    </div>
                  </div>
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>Female</div>
                      <div className='male-statistics'><strong className='male-number'>1100</strong><span className='female-percentage'>60%</span></div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          <div className="statistic-part-center statistic">
            <div className='education-statistics-title'>
              <h2>Education level</h2>
            </div>
            <div className='education-statistics-body'>
                <div className="item">
                  <Item
                    data={data}
                    subTitle1={subTitle1}
                    colors={colors}
                    radius={radius}
                    hole={hole}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    showLabel={showLabel}
                  />
                </div>
            </div>
          </div>
          <div className="statistic-part-right statistic">
            <div className='employment-statistics-title'>
              <h2>Employment Rate</h2>
            </div>
            <div className='employment-statistics-body'>
                <div className="item">
                  <Item
                    data={data}
                    subTitle1={subTitle1}
                    colors={colors}
                    radius={radius}
                    hole={hole}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    showLabel={showLabel}
                  />
                </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Admin