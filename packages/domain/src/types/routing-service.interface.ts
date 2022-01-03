import { Itinerary, RouteSpecification } from '../models';

export interface IRoutingService {
  /**
   * @param {RouteSpecification} routeSpecification route specification
   * @return A list of itineraries that satisfy the specification. May be an empty list if no route is found.
   */
  fetchRoutesForSpecification(routeSpecification: RouteSpecification): Itinerary[];
}
