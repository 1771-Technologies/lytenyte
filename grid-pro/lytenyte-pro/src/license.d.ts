declare let hasAValidLicense: boolean;

/**
 * Activates a valid license for Graphite Grid and removes the displayed watermark.
 * This function can be called multiple times if necessary.
 *
 * @group License
 * @public
 */
declare function activateLicense(license: string): boolean;

export { activateLicense, hasAValidLicense };
