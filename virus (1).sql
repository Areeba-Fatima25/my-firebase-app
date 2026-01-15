-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 12, 2026 at 01:18 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `virus`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `email`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@health.pk', '$2y$12$fqARLvqFvDvnz.55EtGteuMVCPShujoO0fLjsHTyrnH5NHIDW/GBa', NULL, '2026-01-05 15:10:27', '2026-01-11 00:33:55');

-- --------------------------------------------------------

--
-- Table structure for table `admin_password_reset_tokens`
--

CREATE TABLE `admin_password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `hospital_id` bigint(20) UNSIGNED NOT NULL,
  `purpose` enum('Covid Test','Vaccination') NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patient_id`, `hospital_id`, `purpose`, `date`, `time`, `status`, `created_at`, `updated_at`) VALUES
(3, 2, 2, 'Vaccination', '2024-02-18', '14:00:00', 'Pending', '2026-01-05 15:10:29', '2026-01-05 15:10:29'),
(4, 3, 3, 'Covid Test', '2024-02-22', '09:00:00', 'Rejected', '2026-01-05 15:10:30', '2026-01-05 15:10:30'),
(5, 5, 7, 'Covid Test', '2026-01-16', '11:00:00', 'Rejected', '2026-01-11 10:18:18', '2026-01-11 10:34:44'),
(6, 5, 7, 'Covid Test', '2026-01-15', '10:30:00', 'Approved', '2026-01-11 10:29:20', '2026-01-11 10:34:46'),
(7, 5, 7, 'Vaccination', '2026-01-21', '10:30:00', 'Approved', '2026-01-11 11:28:21', '2026-01-11 11:29:00'),
(8, 6, 8, 'Vaccination', '2026-02-22', '15:00:00', 'Approved', '2026-01-11 14:39:04', '2026-01-11 14:39:31'),
(9, 6, 8, 'Covid Test', '2222-02-22', '12:30:00', 'Approved', '2026-01-11 14:41:28', '2026-01-11 14:42:04');

-- --------------------------------------------------------

--
-- Table structure for table `covid_tests`
--

CREATE TABLE `covid_tests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `hospital_id` bigint(20) UNSIGNED NOT NULL,
  `result` enum('Positive','Negative','Pending') NOT NULL DEFAULT 'Pending',
  `test_date` date NOT NULL,
  `remarks` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `covid_tests`
--

INSERT INTO `covid_tests` (`id`, `appointment_id`, `patient_id`, `hospital_id`, `result`, `test_date`, `remarks`, `file_path`, `created_at`, `updated_at`) VALUES
(2, 6, 5, 7, 'Negative', '2026-01-11', 'shut up', 'covid_reports/1768148685_maxresdefault.jpg', '2026-01-11 11:24:45', '2026-01-11 11:24:45'),
(3, 6, 5, 7, 'Negative', '2026-01-11', 'RT-PCR test conducted.', NULL, '2026-01-11 13:29:53', '2026-01-11 13:29:53'),
(4, 9, 6, 8, 'Positive', '2026-01-11', 'good well done', 'covid_reports/1768160561_maxresdefault.jpg', '2026-01-11 14:42:41', '2026-01-11 14:42:41');

-- --------------------------------------------------------

--
-- Table structure for table `hospitals`
--

CREATE TABLE `hospitals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `profile_photo_path` varchar(2048) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hospitals`
--

INSERT INTO `hospitals` (`id`, `name`, `email`, `profile_photo_path`, `password`, `phone`, `website`, `description`, `address`, `city`, `state`, `zip_code`, `status`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Aga Khan University Hospital', 'akuh@hospital.pk', NULL, '$2y$12$P8XVBSSAZ5QZ.YAweLjLnOZW7aY97c5VbLV6nzE0Uh4e4fWzzcS2q', '021-34861000', NULL, NULL, 'Stadium Road', 'Karachi', NULL, NULL, 'Approved', NULL, '2026-01-05 15:10:28', '2026-01-05 15:10:28'),
(2, 'Shifa International Hospital', 'shifa@hospital.pk', NULL, '$2y$12$KKxCi9QaULym1J5Qr1SQIOuEhq/eT.hgyabvCK/5VRJDMfMbcri.i', '051-8463000', NULL, NULL, 'H-8/4', 'Islamabad', NULL, NULL, 'Approved', NULL, '2026-01-05 15:10:28', '2026-01-05 15:10:28'),
(3, 'Shaukat Khanum Memorial Hospital', 'skmch@hospital.pk', NULL, '$2y$12$LgplEDiTNLLXNxNy5/FP6usiAZYN5Kw5T5L5F5rg7ldrEiJFb0Bw6', '042-35905000', NULL, NULL, '7A Block R-3, Johar Town', 'Lahore', NULL, NULL, 'Approved', NULL, '2026-01-05 15:10:28', '2026-01-05 15:10:28'),
(4, 'Jinnah Postgraduate Medical Centre', 'jpmc@hospital.pk', NULL, '$2y$12$xjqvrl88FwLEVoNIQZoA/.1/WEvOxdalDD3kPodxsiL6iEPHMuxQy', '021-99201300', NULL, NULL, 'Rafiqui Shaheed Road', 'Karachi', NULL, NULL, 'Approved', NULL, '2026-01-05 15:10:28', '2026-01-11 06:15:15'),
(5, 'Lady Reading Hospital', 'lrh@hospital.pk', NULL, '$2y$12$NRhqO4YiDGIAqyo3T7CVtuFLxSwSOFKu/A4wnUR/SgX3Prwn5yL4u', '091-9211430', NULL, NULL, 'Soekarno Road', 'Peshawar', NULL, NULL, 'Approved', NULL, '2026-01-05 15:10:29', '2026-01-05 15:30:06'),
(6, 'hospital', 'hos@gmail.com', NULL, '$2y$12$ejBSdaWxFeP823sNL8zRnOrp6ttq02aW.BZquVg8YqmyB/FCcbqyO', '+923114753069', NULL, NULL, 'rawalpindi', 'Rawalpindi', NULL, NULL, 'Approved', NULL, '2026-01-05 15:33:55', '2026-01-05 15:34:23'),
(7, 'aga khanam', 'khanam@gmail.com', NULL, '$2y$12$ypiNWyWiKSdXw/PtNlX53OZLgbktbndfMBoiQuJH24yd6JaEX88pS', '+923001234988', NULL, NULL, 'gujranwala,street', 'Gujranwala', NULL, NULL, 'Approved', NULL, '2026-01-11 09:08:34', '2026-01-11 09:09:24'),
(8, 'jinnah international', 'jinnah@gmail.com', '/uploads/profile_photos/1768160625_maxresdefault.jpg', '$2y$12$bITram9vS2BG3u8upkpqee4.qdvPz/wA7kYG15xJjOsqE8VgK0sMe', '+923001234988', NULL, NULL, 'gujranwala,street', 'Peshawar', NULL, NULL, 'Approved', NULL, '2026-01-11 14:35:14', '2026-01-11 14:43:45');

-- --------------------------------------------------------

--
-- Table structure for table `hospital_password_reset_tokens`
--

CREATE TABLE `hospital_password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2024_01_01_000001_create_patients_table', 1),
(2, '2024_01_01_000002_create_hospitals_table', 1),
(3, '2024_01_01_000003_create_admins_table', 1),
(4, '2024_01_01_000004_create_vaccines_table', 1),
(5, '2024_01_01_000005_create_appointments_table', 1),
(6, '2024_01_01_000006_create_covid_tests_table', 1),
(7, '2024_01_01_000007_create_vaccinations_table', 1),
(8, '2024_01_01_000008_create_personal_access_tokens_table', 1),
(9, '2026_01_05_193350_create_sessions_table', 1),
(10, '2024_01_01_000009_create_news_table', 2),
(11, '2026_01_11_141150_add_profile_fields_to_hospitals_table', 3),
(12, '2026_01_11_142238_add_profile_photo_to_users_tables', 4),
(13, '2026_01_11_210000_add_file_path_to_covid_tests_table', 5);

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL DEFAULT 'General',
  `published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `excerpt`, `content`, `image`, `category`, `published`, `created_at`, `updated_at`) VALUES
(1, 'New COVID-19 Variant: What You Need to Know', 'Health experts are monitoring a new variant that has emerged. Here is everything you need to know about symptoms and prevention.', '<p>Health experts around the world are closely monitoring a new COVID-19 variant.</p>', 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400', 'Health Alert', 1, '2026-01-11 00:26:26', '2026-01-11 00:26:26'),
(2, 'Vaccination Drive Reaches 1 Million Milestone', 'Our vaccination program has successfully administered over 1 million doses, marking a significant achievement.', 'Our comprehensive COVID-19 vaccination program has achieved a remarkable milestone, successfully administering over one million doses to eligible individuals across the region. This significant accomplishment reflects the dedication of our healthcare professionals and the strong community commitment to public health.\n\nReaching one million doses administered is a testament to the collective effort in safeguarding our community against COVID-19. Each vaccination brings us closer to enhanced protection, reducing severe illness, hospitalizations, and the spread of the virus. This milestone underscores the vital role vaccination plays in building broader immunity and supporting the gradual return to normalcy for families and businesses alike.\n\nWe extend our sincere gratitude to everyone who has received their vaccine. We encourage all eligible residents who have not yet been vaccinated to schedule their appointment. Continuing this momentum is crucial as we strive for a healthier, safer future for everyone. Our commitment remains steadfast in ensuring equitable access to these life-saving vaccines.', 'https://images.unsplash.com/photo-1615631648086-325025c9e51e?w=400', 'Achievement', 1, '2026-01-11 00:26:27', '2026-01-11 13:43:00'),
(3, 'Understanding Booster Shots: Complete Guide', 'Everything you need to know about COVID-19 booster shots, eligibility, and benefits for enhanced protection.', '<p>Booster shots have become an essential part of our ongoing fight against COVID-19.</p>', 'https://smb.ibsrv.net/imageresizer/image/article_manager/1200x1200/168632/1305467/heroimage0.787663001744344103.jpg', 'Guide', 1, '2026-01-11 00:26:27', '2026-01-11 00:50:46'),
(4, 'covid preventions', 'covid', 'covid', 'https://www.halemakua.org/media/W1siZiIsIjIwMjMvMDQvMjcvMDhfMzRfNTRfMTNfUE9TVEVSX0NPVklEX3ByZXZlbnRpb25fcmVtaW5kZXJzX3Zpc2l0c18xN18xMV9pbl8ucG5nIl1d/POSTER_COVID%20prevention%20reminders_visits%20%2817%20%C3%97%2011%20in%29.png?sha=2b721db8', 'General', 1, '2026-01-11 00:52:40', '2026-01-11 00:52:40');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `profile_photo_path` varchar(2048) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `dob` date NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `name`, `email`, `profile_photo_path`, `password`, `mobile`, `dob`, `gender`, `address`, `city`, `remember_token`, `created_at`, `updated_at`) VALUES
(2, 'Fatima Ahmed', 'fatima@user.pk', NULL, '$2y$12$HN9yfRgB6c.lo/ambA8AbOtSqaM65xGMHt.hl2i1bZgaFuCKV1em.', '03217654321', '1995-08-22', 'Female', 'Flat 402, Clifton Gardens', 'Karachi', NULL, '2026-01-05 15:10:29', '2026-01-05 15:10:29'),
(3, 'Zain Malik', 'zain@user.pk', NULL, '$2y$12$me1enZY35orb2f4wNhDxQ.A3G3aUoC/wmjEftKR6nGBRWJC8Za5Ym', '03335555555', '1988-03-10', 'Male', '14-B, Gulberg III', 'Lahore', NULL, '2026-01-05 15:10:29', '2026-01-05 15:10:29'),
(4, 'yahya', 'yahya@gmail.com', NULL, '$2y$12$lwfQ3BtGdb4rd2Dp/lba4.FpAXTzFYA0NAickXbXLwm5.G/yUEZc2', '+923114753069', '2000-02-12', 'Male', 'karachi', 'Karachi', NULL, '2026-01-05 15:36:49', '2026-01-05 15:36:49'),
(5, 'yahya12', 'yaya@gmail.com', NULL, '$2y$12$NSjPSTXVnBZXRZHGX0sIJuAxik7v9A373BOT0ROOKdClFLOEXU5SC', '+923123456789', '2026-01-22', 'Male', 'bahawalpur', 'Bahawalpur', NULL, '2026-01-11 09:12:25', '2026-01-11 09:12:25'),
(6, 'patient443', 'patient12@gmail.com', '/uploads/profile_photos/1768160606_maxresdefault.jpg', '$2y$12$WkGe2mi/bN4Ee6nhwDtc7u/u29SnzvoWA2GteXNI06TGQ/3ZYVozK', '+923123456789', '2000-02-22', 'Male', 'bahawalpur', 'Quetta', NULL, '2026-01-11 14:36:58', '2026-01-11 14:43:26');

-- --------------------------------------------------------

--
-- Table structure for table `patient_password_reset_tokens`
--

CREATE TABLE `patient_password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\Admin', 1, 'admin-token', 'b622941642ff6457a3777547f61e8dd4b92b23034528035950562c7cdab5ef8b', '[\"*\"]', '2026-01-05 15:22:06', NULL, '2026-01-05 15:13:44', '2026-01-05 15:22:06'),
(5, 'App\\Models\\Patient', 4, 'patient-token', '087456ab00566a0e0b355436d0199876029c1ef96240449d6504b023411ea28d', '[\"*\"]', NULL, NULL, '2026-01-05 15:36:49', '2026-01-05 15:36:49'),
(7, 'App\\Models\\Admin', 1, 'admin-token', '3fce5d40a6d31b9a1055917ef3d3ac7059c92e730f9725264faed7c58603bad3', '[\"*\"]', '2026-01-06 11:05:30', NULL, '2026-01-06 10:36:35', '2026-01-06 11:05:30'),
(9, 'App\\Models\\Admin', 1, 'admin-token', 'a1213d97ef9d057ca3343f115391c9d8118a71284e3f1fa9425f5531242594e8', '[\"*\"]', '2026-01-11 00:31:15', NULL, '2026-01-06 14:28:14', '2026-01-11 00:31:15'),
(11, 'App\\Models\\Admin', 1, 'admin-token', 'b5761b8e5d61b33f868d349d7efac6efe1736bcfc8457b94ac5bf80e3d42a424', '[\"*\"]', '2026-01-11 04:15:08', NULL, '2026-01-11 03:37:11', '2026-01-11 04:15:08'),
(12, 'App\\Models\\Admin', 1, 'admin-token', '11e107aaa2a0942c051c18919993777595921706be43020e0de2db1ef53554aa', '[\"*\"]', '2026-01-11 06:03:34', NULL, '2026-01-11 04:29:44', '2026-01-11 06:03:34'),
(13, 'App\\Models\\Admin', 1, 'admin-token', '642e0ef9aa647f0d3d4ab377af7e19d9773f7fb97111697ab320572d521a950e', '[\"*\"]', '2026-01-11 06:02:55', NULL, '2026-01-11 05:58:25', '2026-01-11 06:02:55'),
(15, 'App\\Models\\Hospital', 7, 'hospital-token', '931ea44ceaf0f88a845ae4568ee6f4a31b49c5f9ccf1a7c6e2ee3404ac625442', '[\"*\"]', '2026-01-11 10:19:15', NULL, '2026-01-11 09:09:28', '2026-01-11 10:19:15'),
(16, 'App\\Models\\Patient', 5, 'patient-token', '90ecb102ea0801bf1cf395873e840a4d4539d082bf49c7b97fef41412e07a34c', '[\"*\"]', NULL, NULL, '2026-01-11 09:12:25', '2026-01-11 09:12:25'),
(17, 'App\\Models\\Patient', 5, 'patient-token', '6bbfbe3412f8b727f77e0fab490b5b1efdb04676a88dee4b29592794dae6a5dd', '[\"*\"]', '2026-01-11 09:51:27', NULL, '2026-01-11 09:12:39', '2026-01-11 09:51:27'),
(20, 'App\\Models\\Admin', 1, 'admin-token', '451098a6d7bbba8bd193961ba76057aa14e6488d2a0419e80952ea74e77efa6a', '[\"*\"]', '2026-01-11 14:48:28', NULL, '2026-01-11 14:26:52', '2026-01-11 14:48:28'),
(22, 'App\\Models\\Hospital', 8, 'hospital-token', '3a908abbd6854191d0ac81571b86881b158f3f18adaf2fe876d0697be7eae8dc', '[\"*\"]', '2026-01-11 14:41:36', NULL, '2026-01-11 14:36:00', '2026-01-11 14:41:36'),
(23, 'App\\Models\\Patient', 6, 'patient-token', 'f1bcd04af8b0f10d4998791a463561f89f21a12b89552ce09ca4cde6c3b8f0b4', '[\"*\"]', NULL, NULL, '2026-01-11 14:36:58', '2026-01-11 14:36:58');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('2K9RJOlIIqfRpAGyd6xTLohLlV1DK5ocimypySUO', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRHF6UEFMcXdNc3RhSHdWVFVwN3l4SGtFdlFKZ2lQWnlFd2EyRjZvVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1768148526),
('9AvxFBroOPhUKAq1tSCZAts5Z30KH59YzFjk6tvX', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUnRUMnRXd01SVkJBRjN0U043WE1sY2pzb2FhaHV3bkdONmNjZUlVdSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1768123884);

-- --------------------------------------------------------

--
-- Table structure for table `vaccinations`
--

CREATE TABLE `vaccinations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `appointment_id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `hospital_id` bigint(20) UNSIGNED NOT NULL,
  `vaccine_id` bigint(20) UNSIGNED NOT NULL,
  `dose_number` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `status` enum('Completed','Scheduled','Cancelled') NOT NULL DEFAULT 'Scheduled',
  `vaccination_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vaccinations`
--

INSERT INTO `vaccinations` (`id`, `appointment_id`, `patient_id`, `hospital_id`, `vaccine_id`, `dose_number`, `status`, `vaccination_date`, `created_at`, `updated_at`) VALUES
(2, 7, 5, 7, 1, 1, 'Completed', '2026-01-11', '2026-01-11 12:56:00', '2026-01-11 12:56:00'),
(3, 7, 5, 7, 1, 1, 'Completed', '2026-01-11', '2026-01-11 12:56:09', '2026-01-11 12:56:09'),
(4, 7, 5, 7, 2, 1, 'Completed', '2026-01-11', '2026-01-11 12:56:15', '2026-01-11 12:56:15'),
(5, 7, 5, 7, 1, 1, 'Completed', '2026-01-11', '2026-01-11 12:56:26', '2026-01-11 12:56:26'),
(6, 7, 5, 7, 5, 1, 'Completed', '2026-01-11', '2026-01-11 13:03:34', '2026-01-11 13:03:34'),
(7, 8, 6, 8, 2, 1, 'Completed', '2026-01-11', '2026-01-11 14:40:00', '2026-01-11 14:40:00'),
(8, 8, 6, 8, 2, 1, 'Completed', '2026-01-11', '2026-01-11 14:40:24', '2026-01-11 14:40:24');

-- --------------------------------------------------------

--
-- Table structure for table `vaccines`
--

CREATE TABLE `vaccines` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `manufacturer` varchar(255) NOT NULL,
  `doses_required` tinyint(3) UNSIGNED NOT NULL DEFAULT 2,
  `available` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vaccines`
--

INSERT INTO `vaccines` (`id`, `name`, `manufacturer`, `doses_required`, `available`, `created_at`, `updated_at`) VALUES
(1, 'Sinopharm', 'China National Pharmaceutical Group', 2, 1, '2026-01-05 15:10:27', '2026-01-05 15:10:27'),
(2, 'Pfizer-BioNTech', 'Pfizer Inc.', 2, 1, '2026-01-05 15:10:27', '2026-01-05 15:10:27'),
(5, 'covishield', 'pk', 1, 1, '2026-01-05 15:30:18', '2026-01-11 06:50:07'),
(7, 'vaccine', 'serum', 2, 1, '2026-01-06 14:31:19', '2026-01-06 14:31:19'),
(8, 'tetnus', 'dawai institute of pakistan', 1, 1, '2026-01-11 13:32:14', '2026-01-11 13:32:14'),
(9, 'vaccine001', 'the vaccine company', 3, 1, '2026-01-11 14:28:06', '2026-01-11 14:28:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_username_unique` (`username`),
  ADD UNIQUE KEY `admins_email_unique` (`email`);

--
-- Indexes for table `admin_password_reset_tokens`
--
ALTER TABLE `admin_password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointments_patient_id_date_index` (`patient_id`,`date`),
  ADD KEY `appointments_hospital_id_date_index` (`hospital_id`,`date`),
  ADD KEY `appointments_status_index` (`status`);

--
-- Indexes for table `covid_tests`
--
ALTER TABLE `covid_tests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `covid_tests_appointment_id_foreign` (`appointment_id`),
  ADD KEY `covid_tests_patient_id_index` (`patient_id`),
  ADD KEY `covid_tests_hospital_id_index` (`hospital_id`),
  ADD KEY `covid_tests_result_index` (`result`);

--
-- Indexes for table `hospitals`
--
ALTER TABLE `hospitals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `hospitals_email_unique` (`email`);

--
-- Indexes for table `hospital_password_reset_tokens`
--
ALTER TABLE `hospital_password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `news_published_index` (`published`),
  ADD KEY `news_category_index` (`category`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `patients_email_unique` (`email`);

--
-- Indexes for table `patient_password_reset_tokens`
--
ALTER TABLE `patient_password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `vaccinations`
--
ALTER TABLE `vaccinations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vaccinations_appointment_id_foreign` (`appointment_id`),
  ADD KEY `vaccinations_patient_id_index` (`patient_id`),
  ADD KEY `vaccinations_hospital_id_index` (`hospital_id`),
  ADD KEY `vaccinations_vaccine_id_index` (`vaccine_id`),
  ADD KEY `vaccinations_status_index` (`status`);

--
-- Indexes for table `vaccines`
--
ALTER TABLE `vaccines`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `covid_tests`
--
ALTER TABLE `covid_tests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `hospitals`
--
ALTER TABLE `hospitals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `vaccinations`
--
ALTER TABLE `vaccinations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `vaccines`
--
ALTER TABLE `vaccines`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_hospital_id_foreign` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `covid_tests`
--
ALTER TABLE `covid_tests`
  ADD CONSTRAINT `covid_tests_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `covid_tests_hospital_id_foreign` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `covid_tests_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `vaccinations`
--
ALTER TABLE `vaccinations`
  ADD CONSTRAINT `vaccinations_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vaccinations_hospital_id_foreign` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vaccinations_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vaccinations_vaccine_id_foreign` FOREIGN KEY (`vaccine_id`) REFERENCES `vaccines` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
