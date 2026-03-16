<?php
/**
 * Plugin Name: Dive Spots World Map
 * Description: Umożliwia użytkownikom dodawanie i edycję miejsc nurkowych, moderację wpisów oraz wyświetlanie zatwierdzonych lokalizacji na mapie.
 * Version: 1.0.0
 * Author: Foxorox
 * License: GPL-2.0-or-later
 */

if (! defined('ABSPATH')) {
    exit;
}

class Dive_Spots_World_Map_Plugin
{
    private const POST_TYPE = 'dive_spot';

    public function __construct()
    {
        add_action('init', [$this, 'register_post_type']);
        add_action('add_meta_boxes', [$this, 'register_meta_boxes']);
        add_action('save_post_' . self::POST_TYPE, [$this, 'save_dive_spot_meta']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);

        add_shortcode('dive_spot_submission_form', [$this, 'render_submission_form']);
        add_shortcode('dive_spots_map', [$this, 'render_map']);
        add_shortcode('dive_spots_latest', [$this, 'render_latest_spots']);
        add_shortcode('dive_spots_home', [$this, 'render_homepage']);

        add_action('template_redirect', [$this, 'handle_form_submission']);
        add_action('rest_api_init', [$this, 'register_rest_routes']);
    }

    public function register_post_type(): void
    {
        $labels = [
            'name' => __('Miejsca nurkowe', 'dive-spots-world-map'),
            'singular_name' => __('Miejsce nurkowe', 'dive-spots-world-map'),
            'add_new' => __('Dodaj miejsce', 'dive-spots-world-map'),
            'add_new_item' => __('Dodaj nowe miejsce nurkowe', 'dive-spots-world-map'),
            'edit_item' => __('Edytuj miejsce nurkowe', 'dive-spots-world-map'),
            'new_item' => __('Nowe miejsce nurkowe', 'dive-spots-world-map'),
            'view_item' => __('Zobacz miejsce nurkowe', 'dive-spots-world-map'),
            'search_items' => __('Szukaj miejsc nurkowych', 'dive-spots-world-map'),
            'not_found' => __('Nie znaleziono miejsc nurkowych', 'dive-spots-world-map'),
            'not_found_in_trash' => __('Brak miejsc nurkowych w koszu', 'dive-spots-world-map'),
            'menu_name' => __('Miejsca nurkowe', 'dive-spots-world-map'),
        ];

        register_post_type(self::POST_TYPE, [
            'labels' => $labels,
            'public' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-location-alt',
            'supports' => ['title', 'editor', 'thumbnail', 'author'],
            'has_archive' => true,
            'rewrite' => ['slug' => 'miejsca-nurkowe'],
            'capability_type' => 'post',
            'map_meta_cap' => true,
        ]);
    }

    public function register_meta_boxes(): void
    {
        add_meta_box(
            'dive_spot_location',
            __('Lokalizacja nurkowiska', 'dive-spots-world-map'),
            [$this, 'render_location_metabox'],
            self::POST_TYPE,
            'normal',
            'high'
        );

        add_meta_box(
            'dive_spot_gallery',
            __('Galeria zdjęć', 'dive-spots-world-map'),
            [$this, 'render_gallery_metabox'],
            self::POST_TYPE,
            'normal',
            'default'
        );
    }

    public function render_location_metabox(\WP_Post $post): void
    {
        wp_nonce_field('dive_spot_meta_nonce', 'dive_spot_meta_nonce_field');

        $country = get_post_meta($post->ID, '_dive_country', true);
        $lat = get_post_meta($post->ID, '_dive_lat', true);
        $lng = get_post_meta($post->ID, '_dive_lng', true);

        echo '<p><label for="dive_country"><strong>' . esc_html__('Kraj / region', 'dive-spots-world-map') . '</strong></label><br />';
        echo '<input type="text" id="dive_country" name="dive_country" value="' . esc_attr($country) . '" class="widefat" /></p>';

        echo '<p><label for="dive_lat"><strong>' . esc_html__('Szerokość geograficzna (lat)', 'dive-spots-world-map') . '</strong></label><br />';
        echo '<input type="text" id="dive_lat" name="dive_lat" value="' . esc_attr($lat) . '" class="widefat" /></p>';

        echo '<p><label for="dive_lng"><strong>' . esc_html__('Długość geograficzna (lng)', 'dive-spots-world-map') . '</strong></label><br />';
        echo '<input type="text" id="dive_lng" name="dive_lng" value="' . esc_attr($lng) . '" class="widefat" /></p>';
    }

    public function render_gallery_metabox(\WP_Post $post): void
    {
        $gallery_ids = get_post_meta($post->ID, '_dive_gallery_ids', true);
        echo '<p>' . esc_html__('ID zdjęć oddzielone przecinkami (Media Library):', 'dive-spots-world-map') . '</p>';
        echo '<input type="text" name="dive_gallery_ids" value="' . esc_attr((string) $gallery_ids) . '" class="widefat" />';
    }

    public function save_dive_spot_meta(int $post_id): void
    {
        if (! isset($_POST['dive_spot_meta_nonce_field']) || ! wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['dive_spot_meta_nonce_field'])), 'dive_spot_meta_nonce')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (! current_user_can('edit_post', $post_id)) {
            return;
        }

        $country = isset($_POST['dive_country']) ? sanitize_text_field(wp_unslash($_POST['dive_country'])) : '';
        $lat = isset($_POST['dive_lat']) ? sanitize_text_field(wp_unslash($_POST['dive_lat'])) : '';
        $lng = isset($_POST['dive_lng']) ? sanitize_text_field(wp_unslash($_POST['dive_lng'])) : '';
        $gallery_ids = isset($_POST['dive_gallery_ids']) ? sanitize_text_field(wp_unslash($_POST['dive_gallery_ids'])) : '';

        update_post_meta($post_id, '_dive_country', $country);
        update_post_meta($post_id, '_dive_lat', $lat);
        update_post_meta($post_id, '_dive_lng', $lng);
        update_post_meta($post_id, '_dive_gallery_ids', $gallery_ids);
    }

    public function enqueue_assets(): void
    {
        wp_register_style(
            'leaflet-css',
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
            [],
            '1.9.4'
        );

        wp_register_script(
            'leaflet-js',
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
            [],
            '1.9.4',
            true
        );
    }

    public function enqueue_admin_assets(): void
    {
        wp_enqueue_media();
    }

    public function render_submission_form(): string
    {
        if (! is_user_logged_in()) {
            return '<p>' . esc_html__('Musisz być zalogowany, aby dodać miejsce nurkowe.', 'dive-spots-world-map') . '</p>';
        }

        $notice = '';
        if (isset($_GET['dive_spot_status'])) {
            $status = sanitize_text_field(wp_unslash($_GET['dive_spot_status']));
            if ($status === 'created') {
                $notice = '<p class="dive-notice-success">' . esc_html__('Miejsce zostało zapisane i czeka na moderację.', 'dive-spots-world-map') . '</p>';
            } elseif ($status === 'updated') {
                $notice = '<p class="dive-notice-success">' . esc_html__('Zmiany zostały zapisane i czekają na ponowną moderację.', 'dive-spots-world-map') . '</p>';
            }
        }

        $editing_post = null;
        if (isset($_GET['edit_dive_spot'])) {
            $edit_id = absint($_GET['edit_dive_spot']);
            $candidate = get_post($edit_id);
            if ($candidate instanceof \WP_Post && $candidate->post_type === self::POST_TYPE && (int) $candidate->post_author === get_current_user_id()) {
                $editing_post = $candidate;
            }
        }

        $title_value = $editing_post ? $editing_post->post_title : '';
        $description_value = $editing_post ? $editing_post->post_content : '';
        $country_value = $editing_post ? (string) get_post_meta($editing_post->ID, '_dive_country', true) : '';
        $lat_value = $editing_post ? (string) get_post_meta($editing_post->ID, '_dive_lat', true) : '';
        $lng_value = $editing_post ? (string) get_post_meta($editing_post->ID, '_dive_lng', true) : '';

        ob_start();
        ?>
        <div class="dive-spot-form-wrapper">
            <?php echo wp_kses_post($notice); ?>
            <form method="post" enctype="multipart/form-data" class="dive-spot-form">
                <?php wp_nonce_field('submit_dive_spot', 'submit_dive_spot_nonce'); ?>
                <input type="hidden" name="dive_spot_action" value="save" />
                <input type="hidden" name="dive_spot_id" value="<?php echo esc_attr($editing_post ? (string) $editing_post->ID : ''); ?>" />

                <p>
                    <label for="dive_title"><?php esc_html_e('Nazwa miejsca nurkowego', 'dive-spots-world-map'); ?></label>
                    <input required type="text" id="dive_title" name="dive_title" value="<?php echo esc_attr($title_value); ?>" />
                </p>

                <p>
                    <label for="dive_description"><?php esc_html_e('Opis', 'dive-spots-world-map'); ?></label>
                    <textarea required id="dive_description" name="dive_description" rows="6"><?php echo esc_textarea($description_value); ?></textarea>
                </p>

                <p>
                    <label for="dive_country_front"><?php esc_html_e('Kraj / region', 'dive-spots-world-map'); ?></label>
                    <input required type="text" id="dive_country_front" name="dive_country_front" value="<?php echo esc_attr($country_value); ?>" />
                </p>

                <p>
                    <label for="dive_lat_front"><?php esc_html_e('Szerokość geograficzna (lat)', 'dive-spots-world-map'); ?></label>
                    <input required type="text" id="dive_lat_front" name="dive_lat_front" value="<?php echo esc_attr($lat_value); ?>" />
                </p>

                <p>
                    <label for="dive_lng_front"><?php esc_html_e('Długość geograficzna (lng)', 'dive-spots-world-map'); ?></label>
                    <input required type="text" id="dive_lng_front" name="dive_lng_front" value="<?php echo esc_attr($lng_value); ?>" />
                </p>

                <p>
                    <label for="dive_images"><?php esc_html_e('Zdjęcia (można dodać wiele)', 'dive-spots-world-map'); ?></label>
                    <input type="file" id="dive_images" name="dive_images[]" accept="image/*" multiple />
                </p>

                <p>
                    <button type="submit"><?php echo $editing_post ? esc_html__('Zapisz zmiany i wyślij do moderacji', 'dive-spots-world-map') : esc_html__('Wyślij do moderacji', 'dive-spots-world-map'); ?></button>
                </p>
            </form>
        </div>
        <?php

        return (string) ob_get_clean();
    }

    public function handle_form_submission(): void
    {
        if (! isset($_POST['dive_spot_action']) || $_POST['dive_spot_action'] !== 'save') {
            return;
        }

        if (! is_user_logged_in()) {
            return;
        }

        if (! isset($_POST['submit_dive_spot_nonce']) || ! wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['submit_dive_spot_nonce'])), 'submit_dive_spot')) {
            return;
        }

        $title = isset($_POST['dive_title']) ? sanitize_text_field(wp_unslash($_POST['dive_title'])) : '';
        $description = isset($_POST['dive_description']) ? wp_kses_post(wp_unslash($_POST['dive_description'])) : '';
        $country = isset($_POST['dive_country_front']) ? sanitize_text_field(wp_unslash($_POST['dive_country_front'])) : '';
        $lat = isset($_POST['dive_lat_front']) ? sanitize_text_field(wp_unslash($_POST['dive_lat_front'])) : '';
        $lng = isset($_POST['dive_lng_front']) ? sanitize_text_field(wp_unslash($_POST['dive_lng_front'])) : '';
        $edit_post_id = isset($_POST['dive_spot_id']) ? absint($_POST['dive_spot_id']) : 0;

        if ($title === '' || $description === '' || $country === '' || $lat === '' || $lng === '') {
            return;
        }

        if ($edit_post_id > 0) {
            $existing_post = get_post($edit_post_id);
            if (! $existing_post instanceof \WP_Post || $existing_post->post_type !== self::POST_TYPE || (int) $existing_post->post_author !== get_current_user_id()) {
                return;
            }

            $post_id = wp_update_post([
                'ID' => $edit_post_id,
                'post_title' => $title,
                'post_content' => $description,
                'post_status' => 'pending',
            ], true);
        } else {
            $post_id = wp_insert_post([
                'post_type' => self::POST_TYPE,
                'post_title' => $title,
                'post_content' => $description,
                'post_status' => 'pending',
                'post_author' => get_current_user_id(),
            ], true);
        }

        if (is_wp_error($post_id)) {
            return;
        }

        update_post_meta($post_id, '_dive_country', $country);
        update_post_meta($post_id, '_dive_lat', $lat);
        update_post_meta($post_id, '_dive_lng', $lng);

        $gallery_ids = $this->upload_images_and_get_attachment_ids('dive_images', $post_id);
        if (! empty($gallery_ids)) {
            update_post_meta($post_id, '_dive_gallery_ids', implode(',', $gallery_ids));
            set_post_thumbnail($post_id, (int) $gallery_ids[0]);
        }

        $redirect_status = $edit_post_id > 0 ? 'updated' : 'created';
        wp_safe_redirect(add_query_arg('dive_spot_status', $redirect_status, wp_get_referer() ?: home_url('/')));
        exit;
    }

    private function upload_images_and_get_attachment_ids(string $input_name, int $post_id): array
    {
        if (! isset($_FILES[$input_name]) || ! is_array($_FILES[$input_name]['name'])) {
            return [];
        }

        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        $attachment_ids = [];

        foreach ($_FILES[$input_name]['name'] as $index => $name) {
            if (empty($name)) {
                continue;
            }

            $file_array = [
                'name' => sanitize_file_name((string) $name),
                'type' => $_FILES[$input_name]['type'][$index],
                'tmp_name' => $_FILES[$input_name]['tmp_name'][$index],
                'error' => $_FILES[$input_name]['error'][$index],
                'size' => $_FILES[$input_name]['size'][$index],
            ];

            $attachment_id = media_handle_sideload($file_array, $post_id);
            if (! is_wp_error($attachment_id)) {
                $attachment_ids[] = (int) $attachment_id;
            }
        }

        return $attachment_ids;
    }

    public function render_map(): string
    {
        wp_enqueue_style('leaflet-css');
        wp_enqueue_script('leaflet-js');

        $endpoint = esc_url(rest_url('dive-spots/v1/approved'));

        ob_start();
        ?>
        <div id="dive-spots-map" style="height: 560px; width: 100%;"></div>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                var map = L.map('dive-spots-map').setView([20, 0], 2);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(map);

                fetch('<?php echo $endpoint; ?>')
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (spots) {
                        spots.forEach(function (spot) {
                            if (!spot.lat || !spot.lng) {
                                return;
                            }

                            var marker = L.marker([spot.lat, spot.lng]).addTo(map);
                            marker.bindPopup(
                                '<strong>' + spot.title + '</strong><br/>' +
                                '<em>' + (spot.country || '') + '</em><br/>' +
                                '<a href="' + spot.link + '">Szczegóły</a>'
                            );
                        });
                    });
            });
        </script>
        <?php

        return (string) ob_get_clean();
    }


    public function render_latest_spots($atts = []): string
    {
        $atts = shortcode_atts([
            'limit' => 6,
            'title' => 'Najnowsze miejsca nurkowe',
        ], (array) $atts, 'dive_spots_latest');

        $limit = max(1, min(24, absint($atts['limit'])));
        $title = sanitize_text_field((string) $atts['title']);

        $query = new \WP_Query([
            'post_type' => self::POST_TYPE,
            'post_status' => 'publish',
            'posts_per_page' => $limit,
            'no_found_rows' => true,
        ]);

        if (! $query->have_posts()) {
            $empty_message = '<p>' . esc_html__('Brak opublikowanych miejsc nurkowych.', 'dive-spots-world-map') . '</p>';

            if (is_user_logged_in()) {
                $submission_url = '';
                $submission_page = get_page_by_path('dodaj-miejsce-nurkowe');
                if ($submission_page instanceof \WP_Post) {
                    $submission_url = (string) get_permalink($submission_page);
                }

                if ($submission_url !== '') {
                    $empty_message .= '<p><a href="' . esc_url($submission_url) . '">' . esc_html__('Dodaj pierwsze miejsce nurkowe', 'dive-spots-world-map') . '</a></p>';
                }
            }

            return $empty_message;
        }

        ob_start();
        ?>
        <section class="dive-spots-latest">
            <?php if ($title !== '') : ?>
                <h2><?php echo esc_html($title); ?></h2>
            <?php endif; ?>
            <ul>
                <?php foreach ($query->posts as $post) : ?>
                    <?php $country = (string) get_post_meta($post->ID, '_dive_country', true); ?>
                    <li>
                        <a href="<?php echo esc_url(get_permalink($post)); ?>"><?php echo esc_html(get_the_title($post)); ?></a>
                        <?php if ($country !== '') : ?>
                            <span> — <?php echo esc_html($country); ?></span>
                        <?php endif; ?>
                    </li>
                <?php endforeach; ?>
            </ul>
        </section>
        <?php

        return (string) ob_get_clean();
    }



    public function render_homepage($atts = []): string
    {
        $atts = shortcode_atts([
            'title' => 'Miejsca nurkowe na świecie',
            'latest_limit' => 6,
            'show_form_link' => 'yes',
            'form_page_url' => '',
            'show_inline_form' => 'yes',
        ], (array) $atts, 'dive_spots_home');

        $title = sanitize_text_field((string) $atts['title']);
        $latest_limit = max(1, min(24, absint($atts['latest_limit'])));
        $show_form_link = sanitize_text_field((string) $atts['show_form_link']) === 'yes';
        $form_page_url = esc_url_raw((string) $atts['form_page_url']);
        $show_inline_form = sanitize_text_field((string) $atts['show_inline_form']) === 'yes';

        if ($form_page_url === '' && function_exists('get_permalink')) {
            $form_page = get_page_by_path('dodaj-miejsce-nurkowe');
            if ($form_page instanceof \WP_Post) {
                $form_page_url = (string) get_permalink($form_page);
            }
        }

        $latest_shortcode = sprintf(
            '[dive_spots_latest limit="%d" title="Najnowsze nurkowiska"]',
            $latest_limit
        );

        ob_start();
        ?>
        <section class="dive-spots-home">
            <?php if ($title !== '') : ?>
                <h1><?php echo esc_html($title); ?></h1>
            <?php endif; ?>

            <div class="dive-spots-home-map">
                <?php echo do_shortcode('[dive_spots_map]'); ?>
            </div>

            <div class="dive-spots-home-latest">
                <?php echo do_shortcode($latest_shortcode); ?>
            </div>

            <?php if ($show_form_link) : ?>
                <p class="dive-spots-home-cta">
                    <a href="<?php echo esc_url($form_page_url !== '' ? $form_page_url : '#dive-spot-submission'); ?>"><?php esc_html_e('Dodaj nowe miejsce nurkowe', 'dive-spots-world-map'); ?></a>
                </p>
            <?php endif; ?>

            <?php if ($show_inline_form && $form_page_url === '') : ?>
                <div id="dive-spot-submission" class="dive-spots-home-form">
                    <?php echo do_shortcode('[dive_spot_submission_form]'); ?>
                </div>
            <?php endif; ?>
        </section>
        <?php

        return (string) ob_get_clean();
    }

    public function register_rest_routes(): void
    {
        register_rest_route('dive-spots/v1', '/approved', [
            'methods' => 'GET',
            'callback' => [$this, 'get_approved_spots'],
            'permission_callback' => '__return_true',
        ]);
    }

    public function get_approved_spots(): \WP_REST_Response
    {
        $query = new \WP_Query([
            'post_type' => self::POST_TYPE,
            'post_status' => 'publish',
            'posts_per_page' => 500,
            'no_found_rows' => true,
        ]);

        $spots = [];

        foreach ($query->posts as $post) {
            $spots[] = [
                'id' => $post->ID,
                'title' => get_the_title($post),
                'link' => get_permalink($post),
                'country' => get_post_meta($post->ID, '_dive_country', true),
                'lat' => (float) get_post_meta($post->ID, '_dive_lat', true),
                'lng' => (float) get_post_meta($post->ID, '_dive_lng', true),
            ];
        }

        return new \WP_REST_Response($spots, 200);
    }
}

new Dive_Spots_World_Map_Plugin();
