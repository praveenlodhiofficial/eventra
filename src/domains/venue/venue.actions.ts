"use server";

import { z } from "zod";

import {
  createVenue,
  deleteVenue,
  deleteVenues,
  findAllVenues,
  findVenueById,
  searchVenuesByNameOrCity,
  updateVenueById,
} from "./venue.dal";
import { VenueInput, VenueSchema } from "./venue.schema";

/* -------------------------------------------------------------------------- */
/*                            Create Venue                                    */
/* -------------------------------------------------------------------------- */

export const createVenueAction = async (input: VenueInput) => {
  try {
    const parsed = VenueSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid venue data",
        errors: z.treeifyError(parsed.error),
      };
    }

    const venue = await createVenue(parsed.data);

    return {
      success: true,
      status: 201,
      message: "Venue created successfully",
      data: venue,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                            Update Venue                                    */
/* -------------------------------------------------------------------------- */

export const updateVenueAction = async (id: string, input: VenueInput) => {
  try {
    const parsed = VenueSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid venue data",
        errors: z.treeifyError(parsed.error),
      };
    }

    const venue = await updateVenueById(id, parsed.data);

    return {
      success: true,
      status: 200,
      message: "Venue updated successfully",
      data: venue,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                            Delete Venue Action                            */
/* -------------------------------------------------------------------------- */

export const deleteVenueAction = async (id: string) => {
  try {
    const venue = await deleteVenue(id);

    if (!venue) {
      return {
        success: false,
        status: 404,
        message: "Venue not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Venue deleted successfully",
      data: venue,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                         Delete Venues Action                          */
/* -------------------------------------------------------------------------- */

export const deleteVenuesAction = async (ids: string[]) => {
  try {
    const venues = await deleteVenues(ids);

    if (!venues) {
      return {
        success: false,
        status: 404,
        message: "Venues not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Venues deleted successfully",
      data: venues,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                            Get Venue                                       */
/* -------------------------------------------------------------------------- */

export const getVenueAction = async (id: string) => {
  try {
    const venue = await findVenueById(id);

    if (!venue) {
      return {
        success: false,
        status: 404,
        message: "Venue not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Venue fetched successfully",
      data: venue,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                            List All Venues                                 */
/* -------------------------------------------------------------------------- */

export const listVenuesAction = async () => {
  try {
    const venues = await findAllVenues();

    return {
      success: true,
      status: 200,
      message: "Venues fetched successfully",
      data: venues,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                            Search Venues Action                        */
/* -------------------------------------------------------------------------- */

export const searchVenuesAction = async (query: string) => {
  if (!query || query.trim().length < 2) return [];

  try {
    return await searchVenuesByNameOrCity(query.trim(), 10);
  } catch (error) {
    console.error(error);
    return [];
  }
};
