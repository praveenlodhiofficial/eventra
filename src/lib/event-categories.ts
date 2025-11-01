import { EventCategory, EventSubCategory } from "@/generated/prisma";

/**
 * Maps each EventCategory to its valid EventSubCategory options
 * This ensures users can only select subcategories that belong to their chosen category
 */
export const categoryToSubCategories: Record<EventCategory, EventSubCategory[]> = {
   [EventCategory.ENTERTAINMENT_MUSIC]: [
      EventSubCategory.CONCERTS,
      EventSubCategory.FESTIVALS,
      EventSubCategory.COMEDY,
      EventSubCategory.THEATRE,
      EventSubCategory.MOVIE_SCREENINGS,
      EventSubCategory.OTHER,
   ],
   [EventCategory.PROFESSIONAL_BUSINESS]: [
      EventSubCategory.CONFERENCES,
      EventSubCategory.WORKSHOPS,
      EventSubCategory.SEMINARS,
      EventSubCategory.NETWORKING,
      EventSubCategory.PRODUCT_LAUNCHES,
      EventSubCategory.CAREER_FAIRS,
      EventSubCategory.OTHER,
   ],
   [EventCategory.EDUCATION_LEARNING]: [
      EventSubCategory.WEBINARS,
      EventSubCategory.TECH_TALKS,
      EventSubCategory.HACKATHON,
      EventSubCategory.ACADEMIC_CONFERENCE,
      EventSubCategory.LECTURES,
      EventSubCategory.STUDENT_ACTIVITIES_CLUB,
      EventSubCategory.OTHER,
   ],
   [EventCategory.COMMUNITY_SOCIAL]: [
      EventSubCategory.MEETUPS,
      EventSubCategory.CHARITY_FUNDRAISERS,
      EventSubCategory.RELIGIOUS_SPIRITUAL_GATHERING,
      EventSubCategory.CULTURAL_EVENTS,
      EventSubCategory.SOCIAL_MIXERS,
      EventSubCategory.OTHER,
   ],
   [EventCategory.LIFESTYLE_WELLNESS]: [
      EventSubCategory.FITNESS,
      EventSubCategory.HEALTHCAMPS,
      EventSubCategory.AWARENESS_PROGRAMS,
      EventSubCategory.RETREATS,
      EventSubCategory.FASHION,
      EventSubCategory.BEAUTY,
      EventSubCategory.OTHER,
   ],
   [EventCategory.SPORTS_ADVENTURE]: [
      EventSubCategory.TOURNAMENTS,
      EventSubCategory.MARATHONS,
      EventSubCategory.ADVENTURE_TRIPS,
      EventSubCategory.ESPORTS,
      EventSubCategory.OTHER,
   ],
   [EventCategory.EXHIBITIONS_TRADE]: [
      EventSubCategory.TRADE_SHOW,
      EventSubCategory.EXPO,
      EventSubCategory.ART_CRAFT_EXHIBITION,
      EventSubCategory.FOOD_FESTIVAL,
      EventSubCategory.STARTUP_INNOVATION_FAIR,
      EventSubCategory.OTHER,
   ],
   [EventCategory.TECHNOLOGY_INNOVATION]: [
      EventSubCategory.AI_ML_CONFERENCE,
      EventSubCategory.STARTUP_PITCH_EVENT,
      EventSubCategory.DEVELOPER_SUMMIT,
      EventSubCategory.PRODUCT_LAUNCH,
      EventSubCategory.BLOCKCHAIN_WEB3_MEETUP,
      EventSubCategory.OTHER,
   ],
   [EventCategory.ACADEMIC_INSTITUTIONAL]: [
      EventSubCategory.COLLEGE_FEST,
      EventSubCategory.ANNUAL_FUNCTION,
      EventSubCategory.WORKSHOP_LECTURE,
      EventSubCategory.GUEST_LECTURE,
      EventSubCategory.PAPER_PRESENTATION,
      EventSubCategory.PROJECT_EXHIBITION,
      EventSubCategory.OTHER,
   ],
};

/**
 * Human-readable labels for categories
 */
export const categoryLabels: Record<EventCategory, string> = {
   [EventCategory.ENTERTAINMENT_MUSIC]: "Entertainment & Music",
   [EventCategory.PROFESSIONAL_BUSINESS]: "Professional & Business",
   [EventCategory.EDUCATION_LEARNING]: "Education & Learning",
   [EventCategory.COMMUNITY_SOCIAL]: "Community & Social",
   [EventCategory.LIFESTYLE_WELLNESS]: "Lifestyle & Wellness",
   [EventCategory.SPORTS_ADVENTURE]: "Sports & Adventure",
   [EventCategory.EXHIBITIONS_TRADE]: "Exhibitions & Trade",
   [EventCategory.TECHNOLOGY_INNOVATION]: "Technology & Innovation",
   [EventCategory.ACADEMIC_INSTITUTIONAL]: "Academic / Institutional",
};

/**
 * Human-readable labels for subcategories
 */
export const subCategoryLabels: Record<EventSubCategory, string> = {
   // Entertainment & Music
   [EventSubCategory.CONCERTS]: "Concerts",
   [EventSubCategory.FESTIVALS]: "Festivals",
   [EventSubCategory.COMEDY]: "Comedy Shows",
   [EventSubCategory.THEATRE]: "Theatre / Drama",
   [EventSubCategory.MOVIE_SCREENINGS]: "Movie Screenings / Premieres",
   // Professional & Business
   [EventSubCategory.CONFERENCES]: "Conferences / Summits",
   [EventSubCategory.WORKSHOPS]: "Workshops / Bootcamps",
   [EventSubCategory.SEMINARS]: "Seminars / Lectures",
   [EventSubCategory.NETWORKING]: "Networking Events",
   [EventSubCategory.PRODUCT_LAUNCHES]: "Product Launches / Demos",
   [EventSubCategory.CAREER_FAIRS]: "Career Fairs / Recruitment Drives",
   // Education & Learning
   [EventSubCategory.WEBINARS]: "Webinars",
   [EventSubCategory.TECH_TALKS]: "Tech Talks",
   [EventSubCategory.HACKATHON]: "Hackathons",
   [EventSubCategory.ACADEMIC_CONFERENCE]: "Academic Conferences",
   [EventSubCategory.LECTURES]: "Lectures",
   [EventSubCategory.STUDENT_ACTIVITIES_CLUB]: "Student Activities / Club Events",
   // Community & Social
   [EventSubCategory.MEETUPS]: "Meetups",
   [EventSubCategory.CHARITY_FUNDRAISERS]: "Charity / Fundraisers",
   [EventSubCategory.RELIGIOUS_SPIRITUAL_GATHERING]: "Religious / Spiritual Gatherings",
   [EventSubCategory.CULTURAL_EVENTS]: "Cultural Events",
   [EventSubCategory.SOCIAL_MIXERS]: "Social Mixers",
   // Lifestyle & Wellness
   [EventSubCategory.FITNESS]: "Fitness / Yoga Sessions",
   [EventSubCategory.HEALTHCAMPS]: "Health Camps",
   [EventSubCategory.AWARENESS_PROGRAMS]: "Awareness Programs",
   [EventSubCategory.RETREATS]: "Retreats / Wellness Workshops",
   [EventSubCategory.FASHION]: "Fashion Shows",
   [EventSubCategory.BEAUTY]: "Beauty / Lifestyle Expos",
   // Sports & Adventure
   [EventSubCategory.TOURNAMENTS]: "Tournaments / Competitions",
   [EventSubCategory.MARATHONS]: "Marathons / Races",
   [EventSubCategory.ADVENTURE_TRIPS]: "Adventure Trips / Treks",
   [EventSubCategory.ESPORTS]: "E-sports / Gaming Events",
   // Exhibitions & Trade
   [EventSubCategory.TRADE_SHOW]: "Trade Shows",
   [EventSubCategory.EXPO]: "Expos",
   [EventSubCategory.ART_CRAFT_EXHIBITION]: "Art & Craft Exhibitions",
   [EventSubCategory.FOOD_FESTIVAL]: "Food Festivals / Tastings",
   [EventSubCategory.STARTUP_INNOVATION_FAIR]: "Startup & Innovation Fairs",
   // Technology & Innovation
   [EventSubCategory.AI_ML_CONFERENCE]: "AI / ML Conferences",
   [EventSubCategory.STARTUP_PITCH_EVENT]: "Startup Pitch Events",
   [EventSubCategory.DEVELOPER_SUMMIT]: "Developer Summits / Devfests",
   [EventSubCategory.PRODUCT_LAUNCH]: "Product Launch Events",
   [EventSubCategory.BLOCKCHAIN_WEB3_MEETUP]: "Blockchain / Web3 Meetups",
   // Academic / Institutional
   [EventSubCategory.COLLEGE_FEST]: "College Fests",
   [EventSubCategory.ANNUAL_FUNCTION]: "Annual Functions",
   [EventSubCategory.WORKSHOP_LECTURE]: "Workshops / Guest Lectures",
   [EventSubCategory.GUEST_LECTURE]: "Guest Lectures",
   [EventSubCategory.PAPER_PRESENTATION]: "Paper Presentations",
   [EventSubCategory.PROJECT_EXHIBITION]: "Project Exhibitions",
   // Other
   [EventSubCategory.OTHER]: "Other",
};

/**
 * Get subcategories for a given category
 */
export function getSubCategoriesForCategory(
   category: EventCategory | null | undefined
): EventSubCategory[] {
   if (!category) return [];
   return categoryToSubCategories[category] || [];
}

/**
 * Check if a subcategory belongs to a category
 */
export function isSubCategoryValidForCategory(
   category: EventCategory | null | undefined,
   subCategory: EventSubCategory | null | undefined
): boolean {
   if (!category || !subCategory) return false;
   const validSubCategories = getSubCategoriesForCategory(category);
   return validSubCategories.includes(subCategory);
}
