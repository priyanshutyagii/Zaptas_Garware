import AnnouncementCard from "../components/UI/AnnouncementCard ";
import AwardsCard from "../components/UI/AwardsCard";
import Banner from "../components/UI/Banner";
import BirthdayBox from "../components/UI/BirthdayBox";
import CalendarCard from "../components/UI/CalendarCard";
import CsrActivityCard from "../components/UI/CsrActivityCard";
import GalleryCard from "../components/UI/GalleryCard";
import IndustryCard from "../components/UI/IndustryCard";
import ITRequest from "../components/UI/ITRequest";
import LinkedInCard from "../components/UI/LinkedInCard";
import ManagementMessageCard from "../components/UI/ManagementMessageCard";
import NewJoiners from "../components/UI/NewJoiners";
import WorkAnniversary from "../components/UI/WorkAnniversary";

export default function Home() {
  return (
    <div>
      <Banner />

      <div className="container-fluid p-4">
        <div className="row">
          <div className="col-md-4">
            <LinkedInCard />
          </div>
          <div className="col-md-4">
            <AnnouncementCard />
          </div>
          <div className="col-md-4">
       
          <AwardsCard />
          </div>
          <div className="col-md-4">
            <CalendarCard />
          </div>
          <div className="col-md-4">
          <IndustryCard />
          </div>
          <div className="col-md-4">
            <CsrActivityCard />
          </div>
          <div className="col-md-4">
            <GalleryCard />
          </div>
          <div className="col-md-4">
            <ITRequest />
          </div>
          <div className="col-md-4">
           
            <ManagementMessageCard />
          </div>
        </div>
        <div className="birthday-wish">
          <BirthdayBox />
        </div>
        <div className="birthday-wish">
          <WorkAnniversary />
        </div>
        <div className="birthday-wish">
          <NewJoiners />
        </div>
      </div>
    </div>
  );
}
