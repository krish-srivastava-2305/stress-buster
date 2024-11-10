import LogInPage from "@/components/LogInPage";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Home() {
  return (
    <div className="relative h-full w-full">
      <LogInPage />
      <BackgroundBeams/> 
    </div>
  );
}
