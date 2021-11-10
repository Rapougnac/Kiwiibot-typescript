declare module 'mal-scraper' {
    let search: Search;

    /**
     * Get infos about an anime from the given name.
     * @param name The name of the anime to search, the best match corresponding to that name will be returned.
     * @param getBestMatch Whether you want to use [`match-sorter`](https://github.com/kentcdodds/match-sorter) to find the best result or not. (Default to `true`)
     * @returns A promise that resolves to an object containing the infos about the anime.
     */
    function getInfoFromName(
        name: string,
        getBestMatch: boolean
    ): Promise<AnimeDataModel>;

    /**
     * Get infos about an anime from the given URL.
     * @param url The URL of the anime to search.
     * @returns Same as {@link getInfoFromName `getInfoFromName()`}.
     */
    function getInfoFromURL(url: string): Promise<AnimeDataModel>;

    /**
     * Return an array of a maximum length of 10 containing {@link SearchResultsDataModel Search result data model} objects.
     * @param query The query to search.
     */
    function getResultsFromSearch(
        query: string
    ): Promise<SearchResultsDataModel[]>;

    /**
     * Get the list of animes, OVAs, movies and ONAs released (or planned to be released) during the season of the given year.
     * @param year The year of the anime to search.
     * @param season The season of the anime to search.
     * @param type The type of the anime to search.
     */
    function getSeason(
        year: number,
        season: Seasons,
        type?: Types
    ): Promise<SeasonDataModel>;

    /**
     * Get the watchlist of the given user.
     * @param username The username of the user to search.
     * @param after Useful to paginate. Is the number of results you want to start from. By default, MAL returns 300 entries only.
     * @param type Optional, can be either `anime` or `manga`.
     */
    function getWatchListFromUser(
        username: string,
        after?: number,
        type?: AllowedTypes
    ): Promise<any>;

    // /**
    //  * Get infos about an anime from the given MAL ID.
    //  * @param id The MAL ID of the anime to search.
    //  * @returns Same as {@link getInfoFromName `getInfoFromName()`}.
    //  */
    // function getInfoFromID(id: number): Promise<AnimeDataModel>;

    //=/ ---- TYPES ---- /=//

    /**
     * The allowed types for {@link Search.search}
     */
    type AllowedTypes = 'anime' | 'manga';

    /**
     * The search variable
     */
    type Search = {
        /**
         * Search an anime/manga from the given informations
         * @param type Type of search (manga or anime)
         * @param options Options for the search, all keys are optional
         */
        search<A extends AllowedTypes>(
            type: A,
            options?: SearchOptions
        ): Promise<A extends 'anime' ? AnimeSearchModel[] : MangaSearchModel[]>;

        /**
         * Helpers for types, genres and list you might need for your research
         */
        helpers: Helpers;
    };

    type GenreValues =
        | '1'
        | '2'
        | '3'
        | '4'
        | '5'
        | '6'
        | '7'
        | '8'
        | '9'
        | '10'
        | '11'
        | '12'
        | '13'
        | '14'
        | '15'
        | '16'
        | '17'
        | '18'
        | '19'
        | '20'
        | '21'
        | '22'
        | '23'
        | '24'
        | '25'
        | '26'
        | '27'
        | '28'
        | '29'
        | '30'
        | '31'
        | '32'
        | '33'
        | '34'
        | '35'
        | '36'
        | '37'
        | '38'
        | '39'
        | '40'
        | '41'
        | '42'
        | '43';

    type GenreName =
        | 'Action'
        | 'Adventure'
        | 'Cars'
        | 'Comedy'
        | 'Dementia'
        | 'Demons'
        | 'Mystery'
        | 'Drama'
        | 'Ecchi'
        | 'Fantasy'
        | 'Game'
        | 'Hentai'
        | 'Historical'
        | 'Horror'
        | 'Kids'
        | 'Magic'
        | 'Martial Arts'
        | 'Mecha'
        | 'Music'
        | 'Parody'
        | 'Samurai'
        | 'Romance'
        | 'School'
        | 'Sci-Fi'
        | 'Shoujo'
        | 'Shoujo Ai'
        | 'Shounen'
        | 'Shounen Ai'
        | 'Space'
        | 'Sports'
        | 'Super Power'
        | 'Vampire'
        | 'Yaoi'
        | 'Yuri'
        | 'Harem'
        | 'Slice of Life'
        | 'Supernatural'
        | 'Military'
        | 'Police'
        | 'Psychological'
        | 'Thriller'
        | 'Seinen'
        | 'Josei';

    type RatingValue = 0 | 1 | 2 | 3 | 4 | 5 | 6;

    type RatingName = 'none' | 'G' | 'PG' | 'PG-13' | 'R' | 'R+' | 'Rx';

    type TypeValue = 0 | 1 | 2 | 3 | 4 | 5 | 6;

    type TypeName =
        | 'none'
        | 'tv'
        | 'movie'
        | 'special'
        | 'ova'
        | 'ona'
        | 'music';

    type StatusValue = 0 | 1 | 2 | 3;

    type StatusName = 'none' | 'finished' | 'currently' | 'not-aired';

    type Score = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    type OrderTypes = [
        'startDate',
        'score',
        'eps',
        'endDate',
        'type',
        'members',
        'rated'
    ];

    type Types =
        | 'TV'
        | 'TVNew'
        | 'TVCon'
        | 'Movies'
        | 'OVAs'
        | 'ONAs'
        | 'Specials';

    type Seasons = 'spring' | 'summer' | 'fall' | 'winter';

    type FullRatings =
        | 'G - All ages'
        | 'PG - Children'
        | 'PG-13 - Teens 13 or older'
        | 'R - 17+'
        | 'R+ - Mild Nudity'
        | 'Rx - Hentai';
    /**
     * `1` - Watching | Reading\
     * `2` - Completed\
     * `3` - On Hold\
     * `4` - Dropped\
     * `6` - Plan to Watch
     */
    type StatusReference = 1 | 2 | 3 | 4 | 6;

    //=/ ---- INTERFACES ---- /=//

    /**
     * All of this properties are optional
     */
    interface SearchOptions {
        maxResults?: number;
        has?: number;
        term: string;
        type?: number;
        status?: number;
        producer?: number;
        rating?: number;
        startDate?: {
            day?: number;
            month?: number;
            year?: number;
        };
        endDate?: {
            day?: number;
            month?: number;
            year?: number;
        };
        genreType: number;
        genre?: [number];
    }

    interface Helpers {
        availableValues: {
            genre: {
                anime: Genres[];
                manga: Genres[];
            };
            p: {
                anime: {
                    name: string;
                    value: string;
                }[];
                manga: {
                    name: string;
                    value: string;
                }[];
            };

            r: Rating[];

            score: Score[];

            status: Status[];

            type: Type[];
        };

        genresList: {
            anime: Genres[];
            manga: Genres[];
        };

        orderTypes: OrderTypes;

        producerList: {
            anime: {
                name: string;
                value: string;
            }[];
            manga: {
                name: string;
                value: string;
            }[];
        };
    }

    interface SearchResultsDataModel {
        /**
         * The unique identifier of the anime/manga
         */
        id: string;

        /**
         * The type of the anime/manga (e.g: anime, manga, special, ova, ona, music..)
         */
        type: string;

        /**
         * The title of the anime/manga
         */
        name: string;

        /**
         * The image URL of the anime/manga
         */
        image_url: string;

        /**
         * The thumbnail URL of the anime/manga
         */
        thumbnail_url: string;

        /**
         * A number representing the accuracy of the result,
         * where 1 is a perfect match and 0 a totally irrelevent result
         */
        es_score: number;

        /**
         * An object containing additional data about this anime
         */
        payload: Payload;
    }

    /**
     * Additionnal data for {@link SearchResultsDataModel}
     */
    interface Payload {
        /**
         * The type of the anime, can be either `TV`, `Movie`, `OVA` or `Special`
         */
        media_type: string;

        /**
         * The year the airing of the anime started
         */
        start_year: number;

        /**
         * The date from wich the airing started to the one from wich ended
         */
        aired: string;

        /**
         * The average score given to this anime
         */
        score: string;

        /**
         * The current status of the anime (e.g: currently airing, finished airing, not yet aired)
         */
        status: StatusName;
    }

    interface Genres {
        value: GenreValues;
        name: GenreName;
    }

    interface Rating {
        value: RatingValue;
        name: RatingName;
    }

    interface Type {
        value: TypeValue;
        name: TypeName;
    }

    interface Status {
        value: StatusValue;
        name: StatusName;
    }

    interface AnimeSearchModel {
        /**
         * Full url for anime thumbnail.
         */
        thumbnail: string;

        /**
         * Full url of the anime page.
         */
        url: string;

        /**
         * Full url of anime trailer, if any.
         */
        video?: string;

        /**
         * Short description of the anime.
         */
        shortDescription: string;

        /**
         * The anime's title.
         */
        title: string;

        /**
         * The anime's type.
         */
        type: string;

        /**
         * The number of episodes.
         */
        nbEps: string;

        /**
         * The anime score.
         */
        score: string;

        /**
         * The anime start date.
         */
        startDate: string;

        /**
         * The anime end date.
         */
        endDate: string;

        /**
         * The anime number of members.
         */
        members: string;

        /**
         * The anime rating.
         */
        rating: string;
    }

    interface MangaSearchModel {
        /**
         * Full url for manga thumbnail.
         */
        thumbnail: string;

        /**
         * Full url of the manga page.
         */
        url: string;

        /**
         * Full url of manga trailer, if any.
         */
        video?: string;

        /**
         * Short description of the manga.
         */
        shortDescription: string;
        /**
         * The manga's title.
         */
        title: string;

        /**
         * The manga's type.
         */
        type: TypeName;

        /**
         * The number of chapters released so far.
         */
        nbChapters: number;

        /**
         * The manga score.
         */
        score: Score;

        /**
         * The manga start date.
         */
        startDate: string;

        /**
         * The manga end date.
         */
        endDate: string;

        /**
         * The manga number of members.
         */
        members: string;

        /**
         * The number of volumes released so far.
         */
        vols: string;
    }

    interface AnimeDataModel {
        /**
         * The title of the anime.
         */
        title: string;

        /**
         * The synopsis of the anime.
         */
        synopsis?: string;

        /**
         * The URL to the cover picture of the anime.
         */
        picture?: string;

        /**
         * An array of {@link CharacterDataModel Character data model} objects.
         */
        characters?: CharacterDataModel[];

        /**
         * An array of {@link StaffDataModel Staff data model} objects.
         */
        staff?: StaffDataModel[];

        /**
         * A trailer to the embedded video of the anime.
         */
        trailer?: string;

        /**
         * The english title of the anime.
         */
        englishTitle?: string;

        /**
         * An array of synonyms of the anime title. (other languages names, related ovas/movies/animes) (e.g: One Piece -> OP)
         */
        synonyms: string[];

        /**
         * The type of the anime (e.g: `TV`, `Movie`, `OVA` or `Special`)
         */
        type?: 'TV' | 'Movie' | 'OVA' | 'Special';

        /**
         * The number of aired episodes.
         */
        episodes?: string;

        /**
         * The status of the anime (e.g: `Finished Airing`, `Currently Airing`, `Not yet aired`)
         */
        status?: StatusName;

        /**
         * The date from which the airing started to the one from which it ended,
         * this property will be empty if one of the two dates is unknown
         */
        aired?: string;

        /**
         * The date when the anime has been premiered.
         */
        premiered?: string;

        /**
         * When the anime is broadcasted.
         */
        broadcast?: string;

        /**
         * The number of volumes of the novel
         */
        volumes?: string;

        /**
         * The number of chapters of the novel
         */
        chapters?: string;

        /**
         * The dates of publication of the novel
         */
        published?: string;

        /**
         * The authors of the novel
         */
        authors?: string;

        /**
         * The serialization of the novel
         */
        serialization?: string;

        /**
         * An array of producer(s) of the anime
         */
        producers?: string[];

        /**
         * An array of the studio(s) of the anime
         */
        studios?: string[];

        /**
         * On what the anime is based on (e.g: based on a manga, Light Novel, etc.)
         */
        source?: string;

        /**
         * An array of genres of the anime (Action, Slice of Life, Drama, etc.)
         */
        genres?: GenreName[];

        /**
         * Average duration of an episode of the anime (or total duration if it's a movie)
         */
        duration?: string;

        /**
         * The rating of the anime (e.g: `Rx`, `R`, `R+`, `PG-13`, `PG`, `G`, `PG-13+`, `Rx+`)
         */
        rating?: FullRatings;

        /**
         * The average score of the anime
         */
        score?: string;

        /**
         * By how many users this anime has been rated, like `"scored by 255,693 users"`
         */
        scoreStats?: string;

        /**
         * The rank of the anime
         */
        ranked?: string;

        /**
         * The popularity of the anime
         */
        popularity?: string;

        /**
         * How many users are members of the anime (have it on their list)
         */
        members?: string;

        /**
         * The count of how many users marked this anime as favorite
         */
        favorites?: string;

        /**
         * The unique identifier of the anime
         */
        id: number;

        /**
         * The URL of the anime page
         */
        url: string;
    }

    interface CharacterDataModel {
        /**
         * Link to the character's page on MyAnimeList
         */
        link: string;

        /**
         * Link to a picture of the character at the best possible resolution
         */
        picture: string;

        /**
         * Their name and surname, like `"Kazuma Takahashi"`
         */
        name: string;

        /**
         * The role of this person has/had in this anime (Main, Supporting, etc...)
         */
        role: string;

        /**
         * An object containing additional data about who dubbed this character
         */
        seiyuu: SeiyuuDataModel;
    }

    /**
     * An object containing additional data about who dubbed this character
     */
    interface SeiyuuDataModel {
        /**
         * Link to the MyAnimeList profile of who dubbed this character
         */
        link: string;

        /**
         * Link to a picture of the seiyuu at the best possible resolution
         */
        picture: string;

        /**
         * Their name and surname, like `"John Doe"`
         */
        name: string;
    }

    /**
     * An object containing additional data about the staff of this anime
     */
    interface StaffDataModel {
        /**
         * Link to the MAL profile of this person
         */
        link: string;

        /**
         * A link to a picture of this person at the best possible resolution
         */
        picture: string;

        /**
         * Their name and surname, like `"John Doe"`
         */
        name: string;

        /**
         * The role of this person has/had in this anime (Director, Sound Director, etc...)
         */
        role: string;
    }

    /**
     * An object containing the season data model
     */
    interface SeasonDataModel {
        /**
         * An array of {@link SeasonDataModel Seasonal anime release data model} objects
         */
        TV: SeasonalDataModel[];

        /**
         * An array of {@link SeasonDataModel Seasonal anime release data model} objects
         */
        TVNew: SeasonalDataModel[];

        /**
         * An array of {@link SeasonDataModel Seasonal anime release data model} objects
         */
        TVCon: SeasonalDataModel[];

        /**
         * An array of {@link SeasonDataModel Seasonal anime release data model} objects
         */
        OVAs: SeasonalDataModel[];

        /**
         * An array of {@link SeasonDataModel Seasonal anime release data model} objects
         */
        ONAs: SeasonalDataModel[];

        /**
         * An array of {@link SeasonDataModel Seasonal anime release data model} objects
         */
        Movies: SeasonalDataModel[];

        /**
         * An array of {@link SeasonDataModel Seasonal anime release data model} objects
         */
        Specials: SeasonalDataModel[];
    }

    interface SeasonalDataModel {
        /**
         * Link to the picture of the anime
         */
        picture: string;

        /**
         * The synopsis of the anime
         */
        synopsis: string;

        /**
         * The licensor of the anime
         */
        licensor: string;

        /**
         * The name of the anime
         */
        title: string;

        /**
         * The direct link to the anime page on MyAnimeList
         */
        link: string;

        /**
         * An array of strings containing the names of the genres of the anime
         */
        genres: GenreName[];

        /**
         * An array of strings containing the producers of the anime
         */
        producers: string[];

        /**
         * From what this anime is based on/an adaptation of (Light Novel, Manga, etc...)
         */
        fromType: string;

        /**
         * The number of the aired episodes this anime has
         */
        nbEps: string;

        /**
         * When this anime has been released
         */
        releaseDate: string;

        /**
         * The average users have given to this anime
         */
        score: string;
    }

    interface UserAnimeEntryDataModel {
        /**
         * Status of the anime in the user's watch list (completed, on-hold...), see the {@link StatusReference Status Reference} for more information
         */
        status: StatusReference;

        /**
         * Score given to the anime/manga by the user
         */
        score: number;

        /**
         * Anime tags for this anime. Tags are separated by a comma.
         */
        tags: string;

        /**
         * Whether this user is rewatching this anime
         */
        isRewatching: number;

        /**
         * Number of episodes this user has watched
         */
        numWatchedEpisodes: number;
    }
}
