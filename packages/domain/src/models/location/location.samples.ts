/**
 * Sample locations, for test purposes.]
 */
import { UnLocode } from './un-locode.model';
import { Location } from './location.model';

export class LocationSamples {
  static samples = {
    HONGKONG: { unLocode: 'CNHKG', name: 'Hongkong' },
    MELBOURNE: { unLocode: 'AUMEL', name: 'Melbourne' },
    STOCKHOLM: { unLocode: 'SESTO', name: 'Stockholm' },
    HELSINKI: { unLocode: 'FIHEL', name: 'Helsinki' },
    CHICAGO: { unLocode: 'USCHI', name: 'Chicago' },
    TOKYO: { unLocode: 'JNTKO', name: 'Tokyo' },
    HAMBURG: { unLocode: 'DEHAM', name: 'Hamburg' },
    SHANGHAI: { unLocode: 'CNSHA', name: 'Shanghai' },
    ROTTERDAM: { unLocode: 'NLRTM', name: 'Rotterdam' },
    GOTHENBURG: { unLocode: 'SEGOT', name: 'Göteborg' },
    HANGZHOU: { unLocode: 'CNHGH', name: 'Hangzhou' },
    NEWYORK: { unLocode: 'USNYC', name: 'New York' },
    DALLAS: { unLocode: 'USDAL', name: 'Dallas' },
  };

  static all = Object.values(LocationSamples.samples).reduce(
    (acc: Map<string, Location>, { unLocode, name }) => {
      acc.set(unLocode, new Location(new UnLocode(unLocode), name));
      return acc;
    },
    new Map<string, Location>(),
  );

  static getAll(): Location[] {
    return Array.from(LocationSamples.all.values());
  }

  static lookup(unLocode: UnLocode): Location {
    return LocationSamples.all.get(unLocode.idString());
  }

  static HONGKONG = LocationSamples.all.get(LocationSamples.samples.HONGKONG.unLocode);

  static MELBOURNE = LocationSamples.all.get(LocationSamples.samples.MELBOURNE.unLocode);

  static STOCKHOLM = LocationSamples.all.get(LocationSamples.samples.STOCKHOLM.unLocode);

  static HELSINKI = LocationSamples.all.get(LocationSamples.samples.HELSINKI.unLocode);

  static CHICAGO = LocationSamples.all.get(LocationSamples.samples.CHICAGO.unLocode);

  static TOKYO = LocationSamples.all.get(LocationSamples.samples.TOKYO.unLocode);

  static HAMBURG = LocationSamples.all.get(LocationSamples.samples.HAMBURG.unLocode);

  static SHANGHAI = LocationSamples.all.get(LocationSamples.samples.SHANGHAI.unLocode);

  static ROTTERDAM = LocationSamples.all.get(LocationSamples.samples.ROTTERDAM.unLocode);

  static GOTHENBURG = LocationSamples.all.get(LocationSamples.samples.GOTHENBURG.unLocode);

  static HANGZHOU = LocationSamples.all.get(LocationSamples.samples.HANGZHOU.unLocode);

  static NEWYORK = LocationSamples.all.get(LocationSamples.samples.NEWYORK.unLocode);

  static DALLAS = LocationSamples.all.get(LocationSamples.samples.DALLAS.unLocode);
}
