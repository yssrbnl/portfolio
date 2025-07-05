import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledProjectsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    &:after {
      bottom: 0.1em;
    }
  }

  .projects-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

const StyledProject = styled.li`
  position: relative;
  cursor: pointer;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .project-inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: auto;
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 35px;

    .folder {
      color: var(--green);
      svg {
        width: 40px;
        height: 40px;
      }
    }

    .project-links {
      display: flex;
      align-items: center;
      margin-right: -10px;
      color: var(--light-slate);

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .project-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .project-description {
    color: var(--light-slate);
    font-size: 17px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }

    .read-more {
      color: var(--green);
      cursor: pointer;
      font-weight: 500;
      margin-left: 5px;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .project-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 25, 47, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;

  .modal-content {
    background-color: var(--light-navy);
    border-radius: var(--border-radius);
    padding: 40px;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);

    .close-button {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      color: var(--light-slate);
      font-size: 24px;
      cursor: pointer;
      padding: 5px;

      &:hover {
        color: var(--green);
      }
    }

    h3 {
      color: var(--lightest-slate);
      margin-bottom: 20px;
      font-size: var(--fz-xl);
    }

    .tech-list {
      display: flex;
      flex-wrap: wrap;
      margin: 20px 0;

      span {
        background-color: var(--navy);
        color: var(--green);
        padding: 5px 10px;
        margin: 5px 10px 5px 0;
        border-radius: 3px;
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
      }
    }

    .description {
      color: var(--light-slate);
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .links {
      display: flex;
      gap: 15px;

      a {
        ${({ theme }) => theme.mixins.button};
        padding: 10px 20px;
        text-decoration: none;

        &.github {
          background-color: transparent;
          border: 1px solid var(--green);
          color: var(--green);

          &:hover {
            background-color: var(--green);
            color: var(--navy);
          }
        }

        &.pdf {
          background-color: var(--green);
          color: var(--navy);

          &:hover {
            background-color: transparent;
            color: var(--green);
            border: 1px solid var(--green);
          }
        }
      }
    }
  }
`;

const Projects = () => {
  const projectsData = [
    {
      node: {
        frontmatter: {
          title: 'Race for Water – Défi Ergonomie Nuit de l\'Info',
          tech: ['HTML', 'CSS', 'JavaScript', 'UX/UI', 'Pierre-Feuille-Ciseaux'],
          github: 'https://github.com/DanerSharifi-FR/race-for-water/blob/master/contact.js',
          external: '',
          pdf: '',
        },
        shortDescription:
          'Défi Soprasteria à la Nuit de l\'Info de Toulouse : créer la page la moins ergonomique et la plus énervante possible...',
        fullDescription:
          'Projet réalisé lors de la Nuit de l\'Info de Toulouse pour le défi Soprasteria qui consistait à créer la page web la moins ergonomique et la plus énervante à utiliser. Le concept incluait des saisies incohérentes mais pas impossibles, avec un système de pierre-feuille-papier-ciseaux obligatoire (avec camera qui reconnait le signe fait par la main) pour valider chaque saisie de chiffre. Si le mini-jeu n\'était pas gagné, tout recommençait à zéro, créant une expérience utilisateur volontairement frustrante. Ce projet démontre une compréhension inverse des bonnes pratiques UX/UI en créant délibérément une interface contre-intuitive.',
      },
    },
    {
      node: {
        frontmatter: {
          title: 'SAE 3.01 – Développement d\'applications IoT/E-commerce',
          tech: ['Java', 'Python', 'PHP', 'MySQL', 'MQTT', 'IoT', 'Multithreading'],
          github: 'https://github.com/IUT-Blagnac/sae-3-01-devapp-2024-2025-g1b6',
          external: '',
          pdf: '/SAE 301 GRP1B6 Doc Technique Java.pdf',
        },
        shortDescription:
          'Développement complet d\'une solution e-commerce avec composants IoT, incluant interface Java de visualisation et scripts Python-MQTT...',
        fullDescription:
          'Projet de développement d\'applications multi-technologies reprenant l\'idée d\'entreprise fictive d\'autres étudiants. Le projet comprend un site e-commerce en PHP/MySQL, une application Java desktop et des composants IoT. Ma contribution principale s\'est concentrée sur toute la partie IoT : conception de l\'architecture de données (PHP/MySQL + Java), implémentation du pattern Singleton, développement de l\'application Java desktop de visualisation des données de consommation énergétique avec sélection des données à afficher. J\'ai créé les scripts Python qui font le pont entre le bus MQTT et l\'application Java (les scripts Python sont exécutés par l\'appli Java). Gestion complète du multithreading Java pour l\'interface et l\'exécution des scripts Python, plus multithreading Python pour la récupération MQTT. Le projet simulait la surveillance des températures et le monitoring des panneaux solaires.',
      },
    },
    {
      node: {
        frontmatter: {
          title: 'SAE 1.02 – Comparaison d\'Algorithmes',
          tech: ['Java', 'POO', 'CSV', 'Algorithmique', 'Complexité'],
          github: 'https://github.com/Hugo0707/SAe23',
          external: '',
          pdf: '/SAE1-02.pdf',
        },
        shortDescription:
          'Développement de programmes Java pour comparer la complexité d\'algorithmes de recherche sur des données étudiantes...',
        fullDescription:
          'Dans le cadre de la SAE 1.02 (S1 BUT Informatique), plusieurs programmes ont été développés pour récupérer une liste d\'étudiants à partir d\'un fichier CSV, les placer dans une structure de données personnalisée, puis effectuer des recherches d\'étudiants via différents algorithmes (recherche simple, recherche avec rupture, recherche dichotomique). L\'objectif était d\'étudier la complexité algorithmique et de comparer les performances de ces différentes approches de recherche sur des jeux de données de tailles variables.',
      },
    },
    {
      node: {
        frontmatter: {
          title: 'SAE 2.02 – Comparaison d\'approches algorithmiques',
          tech: ['Java', 'Python', 'C', 'Algorithmes', 'Complexité', 'Analyse'],
          github: 'https://github.com/IUT-Blagnac/sae2024-2-02-yssrbnl',
          external: '',
          pdf: 'https://github.com/IUT-Blagnac/sae2024-2-02-yssrbnl/blob/main/rapport/rapport.asciidoc',
        },
        shortDescription:
          'Concours d\'algorithmes en deux phases : soumission d\'algorithmes puis évaluation détaillée sur trois critères...',
        fullDescription:
          'Concours d\'algorithmes organisé en deux phases distinctes. Dans la première phase, soumission d\'algorithmes de traitement de chaînes de caractères (enlever les espaces individuels) dans les catégories Simplicité, Efficacité ou Sobriété numérique. Dans la deuxième phase, évaluation détaillée des algorithmes soumis par les autres étudiants selon trois critères objectifs : sobriété numérique (consommation de ressources), lisibilité du code (facilité de maintenance) et efficacité (temps d\'exécution et complexité algorithmique). Chaque algorithme est testé de manière poussée et objective avec des outils de mesure spécialisés, permettant un classement rigoureux des solutions.',
      },
    },
    {
      node: {
        frontmatter: {
          title: 'SAE 23 – Système de gestion IoT des bâtiments IUT',
          tech: ['PHP', 'MySQL', 'MQTT', 'HTML/CSS', 'JavaScript', 'Grafana', 'Node-RED'],
          github: 'https://github.com/gbersoulle/SAE23',
          external: '',
          pdf: '',
        },
        shortDescription:
          'Développement d\'un site web dynamique PHP pour la gestion et le suivi en temps réel des capteurs IoT dans les bâtiments de l\'IUT...',
        fullDescription:
          'Projet de développement d\'un système complet de gestion IoT (S2 BUT R&T) permettant d\'exploiter les données de capteurs répartis dans les bâtiments de l\'IUT. Le système comprend un site web dynamique développé en PHP pur avec backend complet, permettant la gestion de différents accès utilisateurs pour suivre les données des capteurs en temps réel. J\'ai effectué tout le backend PHP dans ce projet. Notre équipe fait partie des rares groupes à avoir implémenté tous les bâtiments et capteurs disponibles, avec des fonctionnalités permettant aux gestionnaires d\'ajouter des capteurs à tracker. Le projet inclut une base de données MySQL, un dashboard Grafana, des scripts de récupération MQTT, et une chaîne de traitement automatisée via des conteneurs.',
      },
    },
    {
      node: {
        frontmatter: {
          title: 'SAE 2.03 – Administration de Systèmes et Sécurité',
          tech: ['Linux', 'Apache2', 'PHP', 'PostgreSQL', 'Ansible', 'HTML/CSS'],
          github: '',
          external: '',
          pdf: '/SAE2-03_Compte_Rendu.pdf',
        },
        shortDescription:
          'Installation et configuration d\'un site web pour l\'association des OVNI d\'Occitanie avec sécurisation serveur...',
        fullDescription:
          'Le projet consistait à installer et configurer un site web pour l\'association fictive des OVNI d\'Occitanie sur un serveur Linux, en assurant la compatibilité des services (Apache2, PHP, PostgreSQL). Le site a été modernisé avec une structure HTML/CSS, un design responsive (flexbox), et des pages dynamiques (PHP). Plusieurs missions annexes portaient sur la sécurisation du serveur (masquage des versions Apache/PHP, gestion des utilisateurs et des clés SSH), l\'automatisation avec Ansible, et l\'installation de logiciels via apt-get. L\'objectif était d\'améliorer l\'esthétique, la sécurité et la facilité d\'utilisation du site, tout en développant des compétences en administration système et cybersécurité.',
      },
    },
    {
      node: {
        frontmatter: {
          title: 'SAE 14 – Portfolio Web',
          tech: ['HTML5', 'CSS3', 'Design responsive'],
          github: '',
          external: '/SAE14/index.html',
          pdf: '/Gant_SAE14.pdf',
        },
        shortDescription:
          'Création d\'un portfolio web entièrement fait à la main en première année avec HTML5 et CSS3 uniquement...',
        fullDescription:
          'Création d\'un portfolio web entièrement fait à la main en première année de BUT Réseaux & Télécommunications (Semestre 1). Développé uniquement avec HTML5 et CSS3 selon les contraintes pédagogiques (pas de JavaScript autorisé). Le site comprend une page about me qui est en anglais, un design responsive et présente mes projets et compétences de l\'époque. Je suis désolé parce que je n\'ai retrouvé qu\'une version de mon site mais sans le contenu. Ce projet démontre ma capacité à créer des interfaces web propres et fonctionnelles avec les technologies de base.',
      },
    },
    {
      node: {
        frontmatter: {
          title: 'SAE 1.04 – Création d\'une base de données',
          tech: ['Base de données', 'Modélisation', 'SQL', 'Conception'],
          github: '',
          external: '',
          pdf: '/SAE1-04.pdf',
        },
        shortDescription:
          'Conception et création d\'une base de données complète avec modélisation et documentation technique...',
        fullDescription:
          'Projet de conception et création d\'une base de données complète réalisé en première année. Le travail comprend l\'analyse des besoins, la modélisation conceptuelle et logique, l\'implémentation de la base de données et la documentation technique. Ce projet démontre ma compréhension des principes fondamentaux des bases de données et ma capacité à concevoir des solutions de stockage de données efficaces et bien structurées.',
      },
    },
    {
      node: {
        frontmatter: {
          title: 'SAE 15 – Gestion énergétique via capteurs IoT',
          tech: ['Bash', 'HTML5/CSS3', 'MQTT', 'JSON', 'Linux', 'Crontab', 'FTP'],
          github: '',
          external: '',
          pdf: '/BOULOUIHA_Rapport_Technique_SAE_15.docx.pdf',
        },
        shortDescription:
          'Système de gestion énergétique d\'un bâtiment via capteurs connectés avec interface web automatisée...',
        fullDescription:
          'Ce projet visait à aider le service technique à gérer l\'énergie d\'un bâtiment de R&D en exploitant les données de capteurs connectés (via MQTT/JSON). Les scripts Bash récupèrent, traitent et stockent les données, calculent des métriques (moyenne, min, max horodatés), puis génèrent une interface web de suivi (HTML/CSS) publiée automatiquement sur un serveur via FTP. L\'ensemble du processus est automatisé grâce à la crontab sous Linux. Le projet inclut aussi la gestion des logs pour le suivi des exécutions et la résolution des problèmes.',
      },
    },
  ];

  const [showMore, setShowMore] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  // Fermer la modal avec Escape
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const GRID_LIMIT = 6;
  const projects = projectsData.filter(({ node }) => node);
  const firstSix = projects.slice(0, GRID_LIMIT);
  const projectsToShow = showMore ? projects : firstSix;

  const handleProjectClick = project => {
    setSelectedProject(project);
  };

  const projectInner = node => {
    const { frontmatter, shortDescription } = node;
    const { github, external, title, tech, pdf } = frontmatter;

    return (
      <div
        className="project-inner"
        onClick={() => handleProjectClick(node)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleProjectClick(node);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Voir les détails du projet ${title}`}>
        <header>
          <div className="project-top">
            <div className="folder">
              <Icon name="Folder" />
            </div>
            <div className="project-links">
              {github && (
                <a
                  href={github}
                  aria-label="Lien GitHub"
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}>
                  <Icon name="GitHub" />
                </a>
              )}
              {pdf && (
                <a
                  href={pdf}
                  aria-label="Télécharger le rapport PDF"
                  className="external"
                  target="_blank"
                  rel="noreferrer"
                  title="Voir le rapport PDF"
                  onClick={e => e.stopPropagation()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10,9 9,9 8,9" />
                  </svg>
                </a>
              )}
              {external && (
                <a
                  href={external}
                  aria-label="Lien externe"
                  className="external"
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}>
                  <Icon name="External" />
                </a>
              )}
            </div>
          </div>

          <h3 className="project-title">{title}</h3>

          <div className="project-description">
            {shortDescription}
            <span className="read-more">Lire plus</span>
          </div>
        </header>

        <footer>
          {tech && (
            <ul className="project-tech-list">
              {tech.map((tech, i) => (
                <li key={i}>{tech}</li>
              ))}
            </ul>
          )}
        </footer>
      </div>
    );
  };

  return (
    <>
      <StyledProjectsSection>
        <h2 ref={revealTitle}>Projets universitaires</h2>

        <Link className="inline-link archive-link" to="/archive" ref={revealArchiveLink}>
          voir tous les projets
        </Link>

        <ul className="projects-grid">
          {prefersReducedMotion ? (
            <>
              {projectsToShow &&
                projectsToShow.map(({ node }, i) => (
                  <StyledProject key={i}>{projectInner(node)}</StyledProject>
                ))}
            </>
          ) : (
            <TransitionGroup component={null}>
              {projectsToShow &&
                projectsToShow.map(({ node }, i) => (
                  <CSSTransition
                    key={i}
                    classNames="fadeup"
                    timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                    exit={false}>
                    <StyledProject
                      key={i}
                      ref={el => (revealProjects.current[i] = el)}
                      style={{
                        transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                      }}>
                      {projectInner(node)}
                    </StyledProject>
                  </CSSTransition>
                ))}
            </TransitionGroup>
          )}
        </ul>

        <button className="more-button" onClick={() => setShowMore(!showMore)}>
          Voir {showMore ? 'moins' : 'plus'}
        </button>
      </StyledProjectsSection>

      {/* Modal pour les détails du projet */}
      {selectedProject && (
        <StyledModal
          onClick={() => setSelectedProject(null)}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setSelectedProject(null);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
              }
            }}
            role="presentation"
            tabIndex={-1}>
            <button
              className="close-button"
              onClick={() => setSelectedProject(null)}
              aria-label="Fermer">
              ×
            </button>

            <h3>{selectedProject.frontmatter.title}</h3>

            <div className="tech-list">
              {selectedProject.frontmatter.tech.map((tech, i) => (
                <span key={i}>{tech}</span>
              ))}
            </div>

            <div className="description">{selectedProject.fullDescription}</div>

            <div className="links">
              {selectedProject.frontmatter.github && (
                <a
                  href={selectedProject.frontmatter.github}
                  target="_blank"
                  rel="noreferrer"
                  className="github">
                  Voir le code GitHub
                </a>
              )}
              {selectedProject.frontmatter.pdf && (
                <a
                  href={selectedProject.frontmatter.pdf}
                  target="_blank"
                  rel="noreferrer"
                  className="pdf">
                  Télécharger le rapport PDF
                </a>
              )}
            </div>
          </div>
        </StyledModal>
      )}
    </>
  );
};

export default Projects;
