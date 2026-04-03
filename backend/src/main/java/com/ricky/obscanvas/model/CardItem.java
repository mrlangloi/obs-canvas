package com.ricky.obscanvas.model;

/*
 * using records, getters are auto-generated
 * to call the getters, write data.id() instead of data.getId()
 */

public record CardItem (
    String id,
    Position position,
    String label,
    String text,
    String url,
    String mediaType, // 'image' | 'video' | 'empty'
    Integer rotation,  // Use Double (Object) instead of double (primitive)
    Integer opacity,   // so they can be null (optional)
    Integer zIndex
) {}