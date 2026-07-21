import { CallToAction, ctaDefaults, CtaContent } from "@/sections/call-to-action";
import { Contact, contactDefaults, ContactContent } from "@/sections/contact";
import { CoreValues, coreValuesDefaults, CoreValuesContent } from "@/sections/core-values";
import { Gallery, galleryDefaults, GalleryContent } from "@/sections/gallery";
import { HeroSection, heroDefaults, HeroContent } from "@/sections/hero-sections";
import { Projects, projectsDefaults, ProjectsContent } from "@/sections/projects";
import { Stats, statsDefaults, StatsContent } from "@/sections/stats";
import { Testimonials, testimonialsDefaults, TestimonialsContent } from "@/sections/testimonials";
import { VisionMission, visionMissionDefaults, VisionMissionContent } from "@/sections/vision-mission";
import { WhyChooseUs, whyChooseUsDefaults, WhyChooseUsContent } from "@/sections/why-choose-us";
import { getSections, getFeaturedProperties } from "@/lib/content";

export default async function Home() {
  const [sections, featured] = await Promise.all([getSections(), getFeaturedProperties()]);

  const merge = <T,>(key: string, defaults: T): T =>
    sections[key] && Object.keys(sections[key]).length
      ? ({ ...defaults, ...sections[key] } as T)
      : defaults;

  return (
    <main>
      <HeroSection content={merge<HeroContent>("hero", heroDefaults)} />
      <Stats content={merge<StatsContent>("stats", statsDefaults)} />
      <Projects content={merge<ProjectsContent>("projects", projectsDefaults)} properties={featured} />
      <Gallery content={merge<GalleryContent>("gallery", galleryDefaults)} />
      <WhyChooseUs content={merge<WhyChooseUsContent>("why_choose_us", whyChooseUsDefaults)} />
      <VisionMission content={merge<VisionMissionContent>("vision_mission", visionMissionDefaults)} />
      <CoreValues content={merge<CoreValuesContent>("core_values", coreValuesDefaults)} />
      <Testimonials content={merge<TestimonialsContent>("testimonials", testimonialsDefaults)} />
      <CallToAction content={merge<CtaContent>("cta", ctaDefaults)} />
      <Contact content={merge<ContactContent>("contact", contactDefaults)} />
    </main>
  );
}
