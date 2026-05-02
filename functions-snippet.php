<?php
/**
 * wp-modern-homepage — functions.php additions
 * Drop into your child theme's functions.php
 */

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style(
        'wmh-style',
        get_stylesheet_directory_uri() . '/assets/css/wmh.css',
        [], '1.0.0'
    );
    wp_enqueue_script(
        'wmh-script',
        get_stylesheet_directory_uri() . '/assets/js/wmh.js',
        [], '1.0.0', true
    );
});

/** Shortcode: hero slider from ACF or custom post meta */
add_shortcode('wmh_slider', function () {
    $slides = get_field('hero_slides') ?: [];
    if (!$slides) return '';

    ob_start(); ?>
    <div class="wmh-slider">
        <?php foreach ($slides as $slide): ?>
        <div class="wmh-slide">
            <?php if (!empty($slide['image'])): ?>
                <img src="<?= esc_url($slide['image']['url']) ?>" alt="<?= esc_attr($slide['title']) ?>">
            <?php endif; ?>
            <div class="wmh-slide__caption">
                <h2><?= esc_html($slide['title']) ?></h2>
                <p><?= esc_html($slide['text']) ?></p>
                <?php if (!empty($slide['link'])): ?>
                    <a href="<?= esc_url($slide['link']['url']) ?>"><?= esc_html($slide['link']['title'] ?: 'Подробнее') ?></a>
                <?php endif; ?>
            </div>
        </div>
        <?php endforeach; ?>
        <button class="wmh-slider__prev" aria-label="Previous">&#8592;</button>
        <button class="wmh-slider__next" aria-label="Next">&#8594;</button>
    </div>
    <?php return ob_get_clean();
});

/** Shortcode: news grid from category */
add_shortcode('wmh_news', function ($atts) {
    $atts = shortcode_atts(['category' => '', 'count' => 3], $atts);

    $query = new WP_Query([
        'post_type'      => 'post',
        'posts_per_page' => (int)$atts['count'],
        'category_name'  => sanitize_text_field($atts['category']),
    ]);

    if (!$query->have_posts()) return '';

    ob_start(); ?>
    <div class="wmh-news-grid">
        <?php while ($query->have_posts()): $query->the_post(); ?>
        <div class="wmh-news-card">
            <?php if (has_post_thumbnail()): ?>
                <img src="<?= esc_url(get_the_post_thumbnail_url(null, 'medium')) ?>" alt="<?= esc_attr(get_the_title()) ?>">
            <?php endif; ?>
            <div class="wmh-news-card__body">
                <h3><?= esc_html(get_the_title()) ?></h3>
                <p><?= esc_html(wp_trim_words(get_the_excerpt(), 18)) ?></p>
                <a href="<?= esc_url(get_permalink()) ?>">Читать далее</a>
            </div>
        </div>
        <?php endwhile; wp_reset_postdata(); ?>
    </div>
    <?php return ob_get_clean();
});