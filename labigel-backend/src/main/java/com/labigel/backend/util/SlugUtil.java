package com.labigel.backend.util;

public class SlugUtil {

    private SlugUtil() {
        // Utility class - prevent instantiation
    }

    /**
     * Generate URL-friendly slug from input string.
     * Handles Turkish character conversion.
     */
    public static String generateSlug(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }

        String slug = input;

        // Replace Turkish characters
        slug = slug.replace('ş', 's').replace('Ş', 's');
        slug = slug.replace('ç', 'c').replace('Ç', 'c');
        slug = slug.replace('ğ', 'g').replace('Ğ', 'g');
        slug = slug.replace('ü', 'u').replace('Ü', 'u');
        slug = slug.replace('ö', 'o').replace('Ö', 'o');
        slug = slug.replace('ı', 'i').replace('İ', 'i');

        // Lowercase
        slug = slug.toLowerCase();

        // Replace spaces and underscores with hyphens
        slug = slug.replaceAll("[\\s_]+", "-");

        // Remove all non [a-z0-9-] characters
        slug = slug.replaceAll("[^a-z0-9-]", "");

        // Collapse multiple hyphens
        slug = slug.replaceAll("-{2,}", "-");

        // Trim leading/trailing hyphens
        slug = slug.replaceAll("^-|-$", "");

        return slug;
    }
}
