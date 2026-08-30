import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  Globe,
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  Building,
  Users,
  GraduationCap,
  Headphones,
  Smartphone,
  Brain,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { contentService } from "@/services/contentService";

const sources = [
  // =========================================================
  // المصادر العامة الأساسية
  // =========================================================

  {
    name: "منظمة الصحة العالمية",
    link: "https://www.who.int",
    icon: <Globe className="w-5 h-5 text-text-primary" />,
    category: "مصادر عامة",
  },
  {
    name: "American Psychological Association",
    link: "https://www.apa.org",
    icon: <Globe className="w-5 h-5 text-text-primary" />,
    category: "مصادر عامة",
  },
  {
    name: "Verywell Mind",
    link: "https://www.verywellmind.com",
    icon: <Globe className="w-5 h-5 text-text-primary" />,
    category: "مصادر عامة",
  },
  {
    name: "PubMed",
    link: "https://pubmed.ncbi.nlm.nih.gov",
    icon: <Globe className="w-5 h-5 text-text-primary" />,
    category: "مصادر أكاديمية",
  },

  // =========================================================
  // DBT — العلاج السلوكي الجدلي
  // =========================================================

  {
    name: "دليل تدريب مهارات العلاج الجدلي السلوكي (عربي)",
    link: "https://dbt-mena.com/ar/",
    icon: <BookOpen size={14} />,
    category: "DBT",
  },
  {
    name: "العلاج المعرفي السلوكي لاضطراب الشخصية الحدية",
    link: "https://dbt-mena.com/ar/",
    icon: <BookOpen size={14} />,
    category: "DBT",
  },
  {
    name: "Building a Life Worth Living - Marsha Linehan",
    link: "https://www.guilford.com/books/Building-a-Life-Worth-Living/Marsha-Linehan/9780812994612",
    icon: <BookOpen size={14} />,
    category: "DBT",
  },
  {
    name: "Dialectical Behavior Therapy - Wikipedia",
    link: "https://en.wikipedia.org/wiki/Dialectical_behavior_therapy",
    icon: <Globe size={14} />,
    category: "DBT",
  },
  {
    name: "قناة DBT-RU (Rutgers University)",
    link: "https://www.youtube.com/@DBTSkillsTraining",
    icon: <Video size={14} />,
    category: "DBT",
  },
  {
    name: "فيديوهات مهارات DBT - Ontario Shores",
    link: "https://www.ontarioshores.ca/dbt-videos-module",
    icon: <Video size={14} />,
    category: "DBT",
  },
  {
    name: "DBT Self Help",
    link: "https://dialecticalbehaviortherapy.com",
    icon: <Globe size={14} />,
    category: "DBT",
  },
  {
    name: "DBT MENA - الشرق الأوسط",
    link: "https://dbt-mena.com/ar/",
    icon: <Building size={14} />,
    category: "DBT",
  },
  {
    name: "Treatment Implementation Collaborative",
    link: "https://www.ticllc.org",
    icon: <Users size={14} />,
    category: "DBT",
  },
  {
    name: "العلاج الجدلي السلوكي - كايروثيرابي",
    link: "https://cairospecialized.com",
    icon: <Globe size={14} />,
    category: "DBT",
  },
  {
    name: "اليقظة الذهنية في علم النفس - مهارات DBT",
    link: "https://www.youtube.com/results?search_query=اليقظة+الذهنية+مهارات+العلاج+السلوكي+الجدلي+Rawy+TV",
    icon: <Video size={14} />,
    category: "DBT",
  },
  {
    name: "العلاج الجدلي السلوكي - التجربة المصرية",
    link: "https://www.maganin.com",
    icon: <Globe size={14} />,
    category: "DBT",
  },
  {
    name: "فعالية التعامل مع الآخرين - Mind Clinic Group",
    link: "https://www.google.com/search?q=Mind+Clinic+Group+فعالية+التعامل+مع+الآخرين+DBT",
    icon: <Users size={14} />,
    category: "DBT",
  },
  {
    name: "ما هو العلاج الجدلي السلوكي DBT؟ - مستشفى إيوان",
    link: "https://www.google.com/search?q=مستشفى+إيوان+العلاج+الجدلي+السلوكي+DBT",
    icon: <Building size={14} />,
    category: "DBT",
  },

  // =========================================================
  // ACT — العلاج بالقبول والالتزام
  // =========================================================

  {
    name: "Acceptance and Commitment Therapy - Wikipedia",
    link: "https://en.wikipedia.org/wiki/Acceptance_and_commitment_therapy",
    icon: <Globe size={14} />,
    category: "ACT",
  },
  {
    name: "Acceptance and Commitment Therapy (ACT): Defusion Tools for Sticky Thoughts",
    link: "https://static1.squarespace.com/static/6811a46c41bbc42489fd17fe/t/68a84075b3a3ea1bb7f5f84d/1755857013320/Acceptance%2Band%2BCommitment%2BTherapy.pdf",
    icon: <FileText size={14} />,
    category: "ACT",
  },
  {
    name: "The ACT Hexaflex - Nesh Nikolic",
    link: "https://neshnikolic.com/hexaflex",
    icon: <Brain size={14} />,
    category: "ACT",
  },
  {
    name: "ACT in Depth - Nesh Nikolic",
    link: "https://neshnikolic.com/act-in-depth",
    icon: <GraduationCap size={14} />,
    category: "ACT",
  },
  {
    name: "There are six core processes in ACT - FINER Program",
    link: "https://finerprogram.org/wp-content/uploads/2023/03/ACT-Hand-Out-for-FINER.pdf",
    icon: <FileText size={14} />,
    category: "ACT",
  },
  {
    name: "Using the ACT Values Daily Diary with Your Therapy Clients - Blueprint",
    link: "https://www.blueprint.ai/blog/using-the-act-values-daily-diary-with-your-therapy-clients",
    icon: <FileText size={14} />,
    category: "ACT",
  },
  {
    name: "Association for Contextual Behavioral Science - ACT",
    link: "https://contextualscience.org/act",
    icon: <Building size={14} />,
    category: "ACT",
  },
  {
    name: "ACT Therapist Manual",
    link: "https://deploymentpsych.org/system/files/member_resource/ACT-D_Therapist_Manual_2.pdf",
    icon: <FileText size={14} />,
    category: "ACT",
  },

  // =========================================================
  // SFBT — العلاج المركّز على الحلول قصير المدى
  // =========================================================

  {
    name: "Solution Focused Therapy - SFBTA",
    link: "https://www.sfbta.org/",
    icon: <BookOpen size={14} />,
    category: "SFBT",
  },
  {
    name: "Checklist - International Solution-Focused Practitioner Certificate",
    link: "https://denversolutions.com/PDFs/Solution-Focused-Therapy-Certification-checklist.pdf",
    icon: <FileText size={14} />,
    category: "SFBT",
  },
  {
    name: "Cognitive Behavioural Therapy or Solution-Focused Brief Therapy?",
    link: "https://www.google.com/search?q=Cognitive+Behavioural+Therapy+or+Solution-Focused+Brief+Therapy+School+of+Positive+Psychology",
    icon: <Globe size={14} />,
    category: "SFBT",
  },
  {
    name: "Effectiveness of Solution-Focused Brief Therapy - Umbrella Review",
    link: "https://www.tandfonline.com/action/doSearch?AllField=Effectiveness+of+solution-focused+brief+therapy+umbrella+review",
    icon: <FileText size={14} />,
    category: "SFBT",
  },
  {
    name: "Efficacy and Executive Function of SFBT on Adolescent Depression",
    link: "https://www.frontiersin.org/search?query=solution-focused%20brief%20therapy%20adolescent%20depression",
    icon: <FileText size={14} />,
    category: "SFBT",
  },
  {
    name: "Solution-Focused Brief Therapy: The Miracle Question",
    link: "https://www.google.com/search?q=SWEET+INSTITUTE+Solution-Focused+Brief+Therapy+Miracle+Question",
    icon: <Globe size={14} />,
    category: "SFBT",
  },
  {
    name: "Solution-Focused Brief Therapy - Wikipedia",
    link: "https://en.wikipedia.org/wiki/Solution-focused_brief_therapy",
    icon: <Globe size={14} />,
    category: "SFBT",
  },
  {
    name: "The Effect of Solution-Focused Versus Problem-Focused Questions - PubMed",
    link: "https://pubmed.ncbi.nlm.nih.gov/?term=The+Effect+of+Solution-Focused+Versus+Problem-Focused+Questions",
    icon: <FileText size={14} />,
    category: "SFBT",
  },
  {
    name: "What is the Evidence for Solution-Focused Brief Therapy in Schools?",
    link: "https://www.google.com/search?q=What+is+the+Evidence+for+Solution-Focused+Brief+Therapy+in+Schools",
    icon: <GraduationCap size={14} />,
    category: "SFBT",
  },

  // =========================================================
  // Psychodynamic — العلاج النفسي الديناميكي
  // =========================================================

  {
    name: "The Evolution of the Psychodynamic Approach and System",
    link: "https://www.google.com/search?q=The+Evolution+of+the+Psychodynamic+Approach+and+System",
    icon: <FileText size={14} />,
    category: "Psychodynamic",
  },
  {
    name: "The Psychodynamic Perspective - Noba Project",
    link: "https://nobaproject.com/modules/the-psychodynamic-perspective",
    icon: <GraduationCap size={14} />,
    category: "Psychodynamic",
  },
  {
    name: "Defense Mechanisms - StatPearls - NCBI",
    link: "https://www.ncbi.nlm.nih.gov/books/NBK559106/",
    icon: <FileText size={14} />,
    category: "Psychodynamic",
  },
  {
    name: "Effectiveness of Long-term Psychodynamic Psychotherapy",
    link: "https://pubmed.ncbi.nlm.nih.gov/?term=Effectiveness+of+Long-term+Psychodynamic+Psychotherapy",
    icon: <FileText size={14} />,
    category: "Psychodynamic",
  },
  {
    name: "Navigating Transference and Countertransference",
    link: "https://www.google.com/search?q=Navigating+Transference+and+Countertransference+Quantum+Units+Education",
    icon: <BookOpen size={14} />,
    category: "Psychodynamic",
  },
  {
    name: "Psychodynamic Psychotherapy vs CBT and Drug Counseling",
    link: "https://www.google.com/search?q=Efficacy+of+Psychodynamic+Psychotherapy+Compared+to+Cognitive+Behavioral+Therapy+and+Drug+Counseling",
    icon: <FileText size={14} />,
    category: "Psychodynamic",
  },
  {
    name: "Evidence-Base for Psychodynamic Psychotherapy With Children and Adolescents",
    link: "https://www.frontiersin.org/search?query=psychodynamic%20psychotherapy%20children%20adolescents",
    icon: <FileText size={14} />,
    category: "Psychodynamic",
  },
  {
    name: "Psychodynamics - Wikipedia",
    link: "https://en.wikipedia.org/wiki/Psychodynamics",
    icon: <Globe size={14} />,
    category: "Psychodynamic",
  },

  // =========================================================
  // مصادر المقارنة والعلاجات العامة
  // =========================================================

  {
    name: "العلاجات الثلاثة CBT و ACT و DBT - مركز مداد",
    link: "https://www.google.com/search?q=مركز+مداد+CBT+ACT+DBT+العلاجات+الثلاثة",
    icon: <BookOpen size={14} />,
    category: "مقارنة",
  },
  {
    name: "The Top Psychology Trends Expected for 2026 - PAR",
    link: "https://www.parinc.com/",
    icon: <GraduationCap size={14} />,
    category: "مصادر عامة",
  },
  {
    name: "قصص النجاح - مركز مطمئن",
    link: "https://www.motmaen.com/",
    icon: <Users size={14} />,
    category: "مصادر عامة",
  },

  // =========================================================
  // What is going on?
  // =========================================================

  {
    name: "Simply Psychology - Cognitive Distortions",
    link: "https://www.simplypsychology.org/cognitive-distortions.html",
    icon: <Brain size={14} />,
    category: "What is going on?",
  },
  {
    name: "Psychology Today - Cognitive Bias",
    link: "https://www.psychologytoday.com/us/basics/cognitive-bias",
    icon: <Globe size={14} />,
    category: "What is going on?",
  },
  {
    name: "Healthline - Cognitive Distortions",
    link: "https://www.healthline.com/health/cognitive-distortions",
    icon: <Globe size={14} />,
    category: "What is going on?",
  },

  // Defense Mechanisms
  {
    name: "Verywell Mind - Defense Mechanisms",
    link: "https://www.verywellmind.com/defense-mechanisms-2795960",
    icon: <Brain size={14} />,
    category: "What is going on?",
  },
  {
    name: "Britannica - Defense Mechanism",
    link: "https://www.britannica.com/science/defense-mechanism",
    icon: <BookOpen size={14} />,
    category: "What is going on?",
  },
  {
    name: "Psychology Today - Defense Mechanisms",
    link: "https://www.psychologytoday.com/us/basics/defense-mechanisms",
    icon: <Globe size={14} />,
    category: "What is going on?",
  },

  // Anxiety
  {
    name: "NIMH - Anxiety Disorders",
    link: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
    icon: <Building size={14} />,
    category: "What is going on?",
  },
  {
    name: "APA - Anxiety",
    link: "https://www.apa.org/topics/anxiety",
    icon: <Globe size={14} />,
    category: "What is going on?",
  },
  {
    name: "Mayo Clinic - Generalized Anxiety Disorder",
    link: "https://www.mayoclinic.org/diseases-conditions/generalized-anxiety-disorder/symptoms-causes/syc-20360803",
    icon: <Building size={14} />,
    category: "What is going on?",
  },

  // Depression
  {
    name: "NIMH - Depression",
    link: "https://www.nimh.nih.gov/health/topics/depression",
    icon: <Building size={14} />,
    category: "What is going on?",
  },
  {
    name: "WHO - Depression",
    link: "https://www.who.int/news-room/fact-sheets/detail/depression",
    icon: <Globe size={14} />,
    category: "What is going on?",
  },
  {
    name: "Mayo Clinic - Depression",
    link: "https://www.mayoclinic.org/diseases-conditions/depression/symptoms-causes/syc-20356007",
    icon: <Building size={14} />,
    category: "What is going on?",
  },

  // Bipolar
  {
    name: "NIMH - Bipolar Disorder",
    link: "https://www.nimh.nih.gov/health/topics/bipolar-disorder",
    icon: <Building size={14} />,
    category: "What is going on?",
  },
  {
    name: "American Psychiatric Association - Bipolar Disorders",
    link: "https://www.psychiatry.org/patients-families/bipolar-disorders/what-is-bipolar-disorder",
    icon: <Globe size={14} />,
    category: "What is going on?",
  },

  // Psychosis
  {
    name: "NIMH - Schizophrenia",
    link: "https://www.nimh.nih.gov/health/topics/schizophrenia",
    icon: <Building size={14} />,
    category: "What is going on?",
  },
  {
    name: "Mayo Clinic - Schizophrenia",
    link: "https://www.mayoclinic.org/diseases-conditions/schizophrenia/symptoms-causes/syc-20354443",
    icon: <Building size={14} />,
    category: "What is going on?",
  },

  // Personality Disorders
  {
    name: "Mayo Clinic - Personality Disorders",
    link: "https://www.mayoclinic.org/diseases-conditions/personality-disorders/symptoms-causes/syc-20354463",
    icon: <Building size={14} />,
    category: "What is going on?",
  },
  {
    name: "American Psychiatric Association - Personality Disorders",
    link: "https://www.psychiatry.org/patients-families/personality-disorders/what-are-personality-disorders",
    icon: <Globe size={14} />,
    category: "What is going on?",
  },
  {
    name: "McLean Hospital - Borderline Personality Disorder",
    link: "https://www.mcleanhospital.org/essential/bpd",
    icon: <Building size={14} />,
    category: "What is going on?",
  },

  // Trauma
  {
    name: "VA - PTSD",
    link: "https://www.ptsd.va.gov/",
    icon: <Building size={14} />,
    category: "What is going on?",
  },
  {
    name: "NIMH - PTSD",
    link: "https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd",
    icon: <Building size={14} />,
    category: "What is going on?",
  },

  // OCD
  {
    name: "International OCD Foundation",
    link: "https://iocdf.org/about-ocd/",
    icon: <Globe size={14} />,
    category: "What is going on?",
  },
  {
    name: "NIMH - OCD",
    link: "https://www.nimh.nih.gov/health/topics/obsessive-compulsive-disorder-ocd",
    icon: <Building size={14} />,
    category: "What is going on?",
  },

  // Eating Disorders
  {
    name: "National Eating Disorders Collaboration",
    link: "https://www.nedc.com.au/eating-disorders/eating-disorders-explained/types/",
    icon: <Globe size={14} />,
    category: "What is going on?",
  },
  {
    name: "NIMH - Eating Disorders",
    link: "https://www.nimh.nih.gov/health/topics/eating-disorders",
    icon: <Building size={14} />,
    category: "What is going on?",
  },

  // Neurodevelopmental
  {
    name: "CHADD - ADHD",
    link: "https://www.chadd.org/",
    icon: <Brain size={14} />,
    category: "What is going on?",
  },
  {
    name: "National Autistic Society - Autism",
    link: "https://www.autism.org.uk/advice-and-guidance/what-is-autism",
    icon: <Brain size={14} />,
    category: "What is going on?",
  },

  // =========================================================
  // Where do you stand?
  // =========================================================

  {
    name: "Gottman Institute - Emotion Coaching",
    link: "https://www.gottman.com/blog/an-introduction-to-emotion-coaching-the-heart-of-parenting/",
    icon: <Brain size={14} />,
    category: "Where do you stand?",
  },
  {
    name: "Psychology Today - Emotion",
    link: "https://www.psychologytoday.com/us/fundamentals/emotion",
    icon: <Globe size={14} />,
    category: "Where do you stand?",
  },
  {
    name: "Beck Institute - CBT Resources",
    link: "https://www.beckinstitute.org/cbt-resources/",
    icon: <GraduationCap size={14} />,
    category: "Where do you stand?",
  },
  {
    name: "Centre for Clinical Interventions - Resources",
    link: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself",
    icon: <FileText size={14} />,
    category: "Where do you stand?",
  },
  {
    name: "Open Psychometrics",
    link: "https://www.openpsychometrics.org/",
    icon: <Brain size={14} />,
    category: "Where do you stand?",
  },
  {
    name: "Mental Health America - Mental Health Tests",
    link: "https://www.mhanational.org/mental-health-tests",
    icon: <FileText size={14} />,
    category: "Where do you stand?",
  },
  {
    name: "Psychology Tools",
    link: "https://www.psychology-tools.com/",
    icon: <FileText size={14} />,
    category: "Where do you stand?",
  },
  {
    name: "National Institute on Drug Abuse",
    link: "https://www.drugabuse.gov/",
    icon: <Building size={14} />,
    category: "Where do you stand?",
  },
  {
    name: "SAMHSA - Addiction Resources",
    link: "https://www.samhsa.gov/find-help/atod",
    icon: <Building size={14} />,
    category: "Where do you stand?",
  },
  {
    name: "SMART Recovery",
    link: "https://www.smartrecovery.org/",
    icon: <Users size={14} />,
    category: "Where do you stand?",
  },

  // =========================================================
  // CBT
  // =========================================================

  {
    name: "APA - Cognitive Behavioral Therapy",
    link: "https://www.apa.org/ptsd-guidelines/patients-and-families/cognitive-behavioral",
    icon: <Globe size={14} />,
    category: "CBT",
  },
  {
    name: "Beck Institute - About CBT",
    link: "https://www.beckinstitute.org/about-cbt/",
    icon: <GraduationCap size={14} />,
    category: "CBT",
  },

  // =========================================================
  // تنظيم المشاعر والتهدئة الذاتية
  // =========================================================

  {
    name: "Therapist Aid - Coping Skills",
    link: "https://www.therapistaid.com/therapy-worksheets/coping-skills/none",
    icon: <FileText size={14} />,
    category: "تنظيم المشاعر",
  },
  {
    name: "Mindful - Mindfulness of Emotions",
    link: "https://www.mindful.org/category/meditation/mindfulness-of-emotions/",
    icon: <Brain size={14} />,
    category: "تنظيم المشاعر",
  },
  {
    name: "Self-Compassion",
    link: "https://self-compassion.org/",
    icon: <Brain size={14} />,
    category: "تنظيم المشاعر",
  },
  {
    name: "Greater Good Science Center - Berkeley",
    link: "https://greatergood.berkeley.edu",
    icon: <GraduationCap size={14} />,
    category: "تنظيم المشاعر",
  },
  {
    name: "APA - Emotions",
    link: "https://www.apa.org/topics/emotions",
    icon: <Globe size={14} />,
    category: "تنظيم المشاعر",
  },
  {
    name: "Therapist Aid - Emotion Worksheets",
    link: "https://www.therapistaid.com/therapy-worksheets/emotions",
    icon: <FileText size={14} />,
    category: "تنظيم المشاعر",
  },

  // =========================================================
  // مصادر الدعم والتطبيقات والبودكاست
  // =========================================================

  {
    name: "7 Cups - Emotional Support",
    link: "https://www.7cups.com",
    icon: <Users size={14} />,
    category: "دعم ومساندة",
  },
  {
    name: "شيزلونج - استشارات نفسية",
    link: "https://www.shezlong.com",
    icon: <Users size={14} />,
    category: "دعم ومساندة",
  },
  {
    name: "The Happiness Lab - Dr. Laurie Santos",
    link: "https://www.happinesslab.fm",
    icon: <Headphones size={14} />,
    category: "بودكاست",
  },
  {
    name: "MoodKit",
    link: "https://moodkitapp.com",
    icon: <Smartphone size={14} />,
    category: "تطبيقات",
  },

  // =========================================================
  // كتب ومراجع
  // =========================================================

  {
    name: "The Body Keeps the Score",
    link: "https://www.goodreads.com/book/show/18693771-the-body-keeps-the-score",
    icon: <BookOpen size={14} />,
    category: "كتب",
  },
  {
    name: "Feeling Good - David Burns",
    link: "https://www.goodreads.com/book/show/20588667-feeling-good",
    icon: <BookOpen size={14} />,
    category: "كتب",
  },
  {
    name: "Atomic Habits - James Clear",
    link: "https://www.goodreads.com/book/show/40591677-atomic-habits",
    icon: <BookOpen size={14} />,
    category: "كتب",
  },
  {
    name: "Man's Search for Meaning - Viktor Frankl",
    link: "https://www.goodreads.com/book/show/222146.Man_s_Search_for_Meaning",
    icon: <BookOpen size={14} />,
    category: "كتب",
  },
  {
    name: "Emotional Intelligence - Daniel Goleman",
    link: "https://www.goodreads.com/book/show/26329.Emotional_Intelligence",
    icon: <BookOpen size={14} />,
    category: "كتب",
  },
  {
    name: "فن إدارة المشاعر - د. إبراهيم الفقي",
    link: "https://www.neelwafurat.com/itempage.aspx?id=lbb224327-301614&search=books",
    icon: <BookOpen size={14} />,
    category: "كتب",
  },

  // =========================================================
  // الصمود ومنع الانتكاس
  // =========================================================

  {
    name: "APA - Resilience",
    link: "https://www.apa.org/topics/resilience",
    icon: <Brain size={14} />,
    category: "التعافي ومنع الانتكاس",
  },
  {
    name: "HelpGuide - Building Better Mental Health",
    link: "https://www.helpguide.org/articles/mental-health/building-better-mental-health.htm",
    icon: <Globe size={14} />,
    category: "التعافي ومنع الانتكاس",
  },
  {
    name: "NCBI - Relapse Prevention",
    link: "https://www.ncbi.nlm.nih.gov/books/NBK551500/",
    icon: <FileText size={14} />,
    category: "التعافي ومنع الانتكاس",
  },
  {
    name: "Relapse Prevention",
    link: "https://www.relapseprevention.org/",
    icon: <Globe size={14} />,
    category: "التعافي ومنع الانتكاس",
  },
  {
    name: "Mental Health America - Preventing Relapse",
    link: "https://www.mhanational.org/preventing-relapse",
    icon: <Globe size={14} />,
    category: "التعافي ومنع الانتكاس",
  },

  // =========================================================
  // ACT الأكاديمي — اختبار القبول الجامعي
  // =========================================================

  {
    name: "2025/2026 - Preparing for the ACT Test",
    link: "https://www.piqosity.com/",
    icon: <GraduationCap size={14} />,
    category: "ACT Academic",
  },
  {
    name: "6 Strategy Tips for ACT Science Data Analysis - Kaplan",
    link: "https://www.kaptest.com/study/act/",
    icon: <GraduationCap size={14} />,
    category: "ACT Academic",
  },
  {
    name: "ACT Time Management Guide 2026 - Acely",
    link: "https://acely.ai/",
    icon: <GraduationCap size={14} />,
    category: "ACT Academic",
  },
  {
    name: "How to Improve Your ACT Reading Score - Piqosity",
    link: "https://www.piqosity.com/",
    icon: <GraduationCap size={14} />,
    category: "ACT Academic",
  },
  {
    name: "What Skills Does the ACT Test? - Makon AI",
    link: "https://www.makonis.com/",
    icon: <GraduationCap size={14} />,
    category: "ACT Academic",
  },

  // =========================================================
  // مصادر إضافية موجودة في النسخة السابقة
  // =========================================================

  {
    name: "NHS - Cognitive Behavioral Therapy Guide",
    link: "https://www.nhs.uk",
    icon: <Globe size={14} />,
    category: "مصادر عامة",
  },
  {
    name: "المعهد الوطني للصحة النفسية - NIMH",
    link: "https://www.nimh.nih.gov",
    icon: <Building size={14} />,
    category: "مصادر عامة",
  },
  {
    name: "قناة د. أحمد عمارة",
    link: "https://www.youtube.com/@ahmedammarapsychology",
    icon: <Video size={14} />,
    category: "فيديوهات",
  },
  {
    name: "TED Talks - Emotions",
    link: "https://www.ted.com/topics/emotions",
    icon: <Video size={14} />,
    category: "فيديوهات",
  },
  {
    name: "مركز جامعة بيركلي لعلوم المشاعر",
    link: "https://greatergood.berkeley.edu",
    icon: <GraduationCap size={14} />,
    category: "مصادر أكاديمية",
  },
  {
    name: "دليل المشاعر الأساسية - Paul Ekman",
    link: "https://www.paulekman.com/universal-emotions/",
    icon: <BookOpen size={14} />,
    category: "مصادر أكاديمية",
  },
];

export default function SourcesPage() {
  const [selectedSource, setSelectedSource] = useState(null);
  const [sourcesList, setSourcesList] = useState(sources);
  const nav = useNavigate();

  useEffect(() => {
    contentService.getScientificReferences()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(item => ({
            name: item.title || '',
            link: item.url || '',
            category: item.category || 'عام',
            icon: <Globe className="w-5 h-5 text-text-primary" />
          }));
          setSourcesList(formatted);
        }
      })
      .catch(err => {
        console.warn('Could not load scientific references from DB:', err);
      });
  }, []);

  const handleClick = (source) => {
    setSelectedSource(source);
  };

  const handleVisit = () => {
    if (!selectedSource) return;

    window.open(
      selectedSource.link,
      "_blank",
      "noopener,noreferrer"
    );

    setSelectedSource(null);
  };

  return (
    <div
      dir="rtl"
      className="flex flex-col min-h-screen bg-bg-app px-4 pb-10 font-sans"
    >
      {/* Header */}
      <header className="flex items-center pt-4 pb-2 justify-between">
        <button
          onClick={() => nav(-1)}
          className="flex size-10 items-center justify-center text-text-primary"
          aria-label="رجوع"
        >
          <ArrowLeft size={24} />
        </button>

        <h2 className="flex-1 text-center pl-10 text-lg font-bold text-text-primary">
          References
        </h2>
      </header>

      {/* Confirmation Box */}
      {selectedSource && (
        <div className="mt-6 mb-6 border border-blue-200 bg-blue-50 p-6 rounded-xl shadow-inner transition-all">
          <p className="text-lg font-semibold mb-4 text-text-primary">
            هل ترغب في زيارة{" "}
            <span className="text-blue-700">
              {selectedSource.name}
            </span>
            ؟
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleVisit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              نعم، أريد ذلك
            </button>

            <button
              onClick={() => setSelectedSource(null)}
              className="px-4 py-2 bg-gray-200 text-text-primary rounded-lg hover:bg-gray-300 transition"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Sources */}
      <div className="grid gap-4">
        {sourcesList.map((source, index) => (
          <button
            key={`${source.name}-${index}`}
            onClick={() => handleClick(source)}
            className="flex items-center gap-3 p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all text-right"
          >
            <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-gray-100 rounded-full">
              {source.icon}
            </div>

            <div className="flex flex-col items-start gap-1">
              <span className="text-lg font-medium text-text-primary">
                {source.name}
              </span>

              {source.category && (
                <span className="text-xs text-gray-500">
                  {source.category}
                </span>
              )}
            </div>

            <ExternalLink
              size={16}
              className="mr-auto text-gray-400 shrink-0"
            />
          </button>
        ))}
      </div>

      <ScrollToTopButton />
    </div>
  );
}
