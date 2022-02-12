// Thank you Taksumaki for helping me with typescript! //
// https://gitlab.com/taksumaki //

declare module "akaneko" {
    /**
     * Returns Safe for Work Neko Images!
     * @returns image uri
     */
    export function neko(): Promise<string>;
  
    /**
     * Returns you lewd ... and dirty ... Neko Images !
     * @returns image uri
     */
    export function lewdNeko(): Promise<string>;
  
    /**
     * Images provided by @LamkasDev !~
     * Returns Safe for Work Foxgirl Images! Thanks @LamkasDev!
     * @returns image uri
     */
    export function foxgirl(): Promise<string>;
  
    /**
     * Returns Sends a bomb of random images of N value!
     * Contributed by @HanBao#8443 !! Thank you so much !
     * @param total amount of lewds! :3
     * @returns image uri
     */
    export function lewdBomb(total: number): Promise<string>;
  
    /**
     * Returns you SFW Anime Wallpapers for Desktops !
     * @returns image uri
     */
    export function wallpapers(): Promise<string>;
  
    /**
     * Returns SFW Anime Wallpapers for Mobile Users !
     * @returns image uri
     */
    export function mobileWallpapers(): Promise<string>;
  
    /**
     * These methods get NSFW images (lewds).
     */
    namespace nsfw {
      /**
       * I know you like anime ass~ uwu
       * @returns image uri
       */
      export function ass(): Promise<string>;
  
      /**
       * If you don't know what it is, search it up
       * @returns image uri
       */
      export function bdsm(): Promise<string>;
  
      /**
       * Basically an image of a girl sucking on a sharp blade!
       * @returns image uri
       */
      export function blowjob(): Promise<string>;
  
      /**
       * Basically sticky white stuff that is usually milked from sharpies.
       * @returns image uri
       */
      export function cum(): Promise<string>;
  
      /**
       * Sends a random doujin page imageURL!
       * @returns image uri
       */
      export function doujin(): Promise<string>;
  
      /**
       * So you like smelly feet huh?
       * @returns image uri
       */
      export function feet(): Promise<string>;
  
      /**
       * Female Domination?
       * @returns image uri
       */
      export function femdom(): Promise<string>;
  
      /**
       * Girl's that are wannabe foxes, yes
       * @returns image uri
       */
      export function foxgirl(): Promise<string>;
  
      /**
       * Basically an animated image, so yes :3
       * @returns image uri
       */
      export function gifs(): Promise<string>;
  
      /**
       * Girls that wear glasses, uwu~
       * @returns image uri
       */
      export function glasses(): Promise<string>;
  
      /**
       * Sends a random vanilla hentai imageURL~
       * @returns image uri
       */
      export function hentai(): Promise<string>;
  
      /**
       * Wow, I won't even question your fetishes.
       * @returns image uri
       */
      export function netorare(): Promise<string>;
  
      /**
       * Maids, Maid Uniforms, etc, you know what maids are :3
       * @returns image uri
       */
      export function maid(): Promise<string>;
  
      /**
       * Solo Queue in CSGO!
       * @returns image uri
       */
      export function masturbation(): Promise<string>;
  
      /**
       * Group Lewd Acts
       */
      export function orgy(): Promise<string>;
  
      /**
       * I mean... just why? You like underwear?
       * @returns image uri
       */
      export function panties(): Promise<string>;
  
      /**
       * The genitals of a female, or a cat, you give the meaning.
       * @returns image uri
       */
      export function pussy(): Promise<string>;
  
      /**
       * School Uniforms!~ Yatta~!
       * @returns image uri
       */
      export function school(): Promise<string>;
  
      /**
       * I'm sorry but, why do they look like intestines?
       * @returns image uri
       */
      export function tentacles(): Promise<string>;
  
      /**
       * The top part of your legs, very hot, isn't it?
       * @returns image uri
       */
      export function thighs(): Promise<string>;
  
      /**
       * The one thing most of us can all agree to hate :)
       * @returns image uri
       */
      export function uglyBastard(): Promise<string>;
  
      /**
       * Military, Konbini, Work, Nurse Uniforms, etc!~ Sexy~
       * @returns image uri
       */
      export function uniform(): Promise<string>;
  
      /**
       * Girls on Girls, and Girl's only!<3
       * @returns image uri
       */
      export function yuri(): Promise<string>;
  
      /**
       * That one part of the flesh being squeeze in thigh-highs~<3
       * @returns image uri
       */
      export function zettaiRyouiki(): Promise<string>;
  
      /**
       * Returns a NSFW mobile wallpaper.
       * @returns image uri
       */
      export function mobileWallpapers(): Promise<string>;
  
      /**
       * Returns a NSFW wallpaper.
       * @returns image uri
       */
      export function wallpapers(): Promise<string>;
  
      /**
       * Spooky Succubus, oh I'm so scared~ Totally don't suck me~
       * @returns image uri
       */
      export function succubus(): Promise<string>;
    }
  }
  