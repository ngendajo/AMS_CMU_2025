import '../../components/DashboardComponents/HelpPart/HelpPart.css';
import HelpImg from '../../components/DashboardComponents/HelpPart/HelpImg.png';

export default function Help() {
    return (
        <div className = "help-center-container">
            <h1>Help Center</h1>

            <h3>
                🎉🎉🎉Welcome ASYV alumni!
                Let's explore the Alumni Management System (AMS) and make the most of its features to stay connected,
                discover opportunities, and engage with ASYV community!!!
            </h3> <br/>

            <h2>Here is the guidance of each part:</h2>

            <p>
                <strong>Home:</strong> Discover visualized statistics in terms of alumni amount, education, employment, etc.</p>
            <p>
                <strong>Events:</strong> Immerse yourself in the colorful world of ASYV! Find a wide range of events and activities that cater to your interests and passions.</p>
            <p>
                <strong>Networks:</strong> Join vibrant ASYV alumni chat groups and connect with fellow alumni from your batch or area of interest.</p>
            <p>
                <strong>Opportunities:</strong> Explore a curated list of job opportunities posted by our alumni and staff. Feel free to share your own opportunities with the community!</p>
            <p>
                <strong>Schedule:</strong> Stay informed about upcoming ASYV activities with a clear and user-friendly calendar. Plan your time effectively and never miss an event!</p>
            <p>
                <strong>Gallery:</strong> Relive cherished memories from your time at ASYV through a collection of captivating photos!</p>
            <p>
                <strong>Users:</strong> Manage and personalize your account by accessing and modifying your information.</p>
            <p>
                <strong>Profile:</strong> Track your comprehensive profile that includes personal information, progress, activity history, and more.</p>
            <br/>

            <p>
                Should you have any questions, please feel free to contact our CRC staff ^_^</p>

            <img
                src={HelpImg} alt="" />
        </div>
    )
}
