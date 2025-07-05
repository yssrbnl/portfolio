import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Layout } from '@components';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledTableContainer = styled.div`
  margin: 100px -20px;

  @media (max-width: 768px) {
    margin: 50px -10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    .hide-on-mobile {
      @media (max-width: 768px) {
        display: none;
      }
    }

    tbody tr {
      &:hover,
      &:focus {
        background-color: var(--light-navy);
      }
    }

    th,
    td {
      padding: 10px;
      text-align: left;

      &:first-child {
        padding-left: 20px;

        @media (max-width: 768px) {
          padding-left: 10px;
        }
      }
      &:last-child {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
        }
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }

    tr {
      cursor: default;

      td:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
      }
      td:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
      }
    }

    td {
      &.year {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
          font-size: var(--fz-sm);
        }
      }

      &.title {
        padding-top: 15px;
        padding-right: 20px;
        color: var(--lightest-slate);
        font-size: var(--fz-xl);
        font-weight: 600;
        line-height: 1.25;
      }

      &.company {
        font-size: var(--fz-lg);
        white-space: nowrap;
      }

      &.tech {
        font-size: var(--fz-xxs);
        font-family: var(--font-mono);
        line-height: 1.5;
        .separator {
          margin: 0 5px;
        }
        span {
          display: inline-block;
        }
      }

      &.links {
        min-width: 100px;

        div {
          display: flex;
          align-items: center;

          a {
            ${({ theme }) => theme.mixins.flexCenter};
            flex-shrink: 0;
          }

          a + a {
            margin-left: 10px;
          }
        }
      }
    }
  }
`;

const ArchivePage = ({ location }) => {
  // Données statiques pour la page archive
  const projectsData = [
    {
      date: '2024',
      title: 'Race for Water – Défi Ergonomie Nuit de l\'Info',
      company: 'Nuit de l\'Info Toulouse',
      tech: ['HTML', 'CSS', 'JavaScript', 'UX/UI'],
      github: 'https://github.com/DanerSharifi-FR/race-for-water/blob/master/contact.js',
      external: '',
      pdf: '',
    },
    {
      date: '2024',
      title: 'SAE 3.01 – Développement d\'applications IoT/E-commerce',
      company: 'IUT de Blagnac',
      tech: ['Java', 'Python', 'PHP', 'MySQL', 'MQTT', 'IoT'],
      github: 'https://github.com/IUT-Blagnac/sae-3-01-devapp-2024-2025-g1b6',
      external: '',
      pdf: '/SAE 301 GRP1B6 Doc Technique Java.pdf',
    },
    {
      date: '2023',
      title: 'SAE 1.02 – Comparaison d\'Algorithmes',
      company: 'IUT de Blagnac',
      tech: ['Java', 'POO', 'CSV', 'Algorithmique'],
      github: 'https://github.com/Hugo0707/SAe23',
      external: '',
      pdf: '/SAE1-02.pdf',
    },
    {
      date: '2024',
      title: 'SAE 2.02 – Comparaison d\'approches algorithmiques',
      company: 'IUT de Blagnac',
      tech: ['Java', 'Python', 'C', 'Algorithmes', 'Complexité'],
      github: 'https://github.com/IUT-Blagnac/sae2024-2-02-yssrbnl',
      external: '',
      pdf: 'https://github.com/IUT-Blagnac/sae2024-2-02-yssrbnl/blob/main/rapport/rapport.asciidoc',
    },
    {
      date: '2023',
      title: 'SAE 23 – Système de gestion IoT des bâtiments IUT',
      company: 'IUT de Blagnac',
      tech: ['PHP', 'MySQL', 'MQTT', 'HTML/CSS', 'JavaScript'],
      github: 'https://github.com/gbersoulle/SAE23',
      external: '',
      pdf: '',
    },
    {
      date: '2024',
      title: 'SAE 2.03 – Administration de Systèmes et Sécurité',
      company: 'IUT de Blagnac',
      tech: ['Linux', 'Apache2', 'PHP', 'PostgreSQL', 'Ansible'],
      github: '',
      external: '',
      pdf: '/SAE2-03_Compte_Rendu.pdf',
    },
    {
      date: '2022',
      title: 'SAE 14 – Portfolio Web',
      company: 'IUT de Blagnac',
      tech: ['HTML5', 'CSS3', 'Design responsive'],
      github: '',
      external: '/SAE14/index.html',
      pdf: '/Gant_SAE14.pdf',
    },
    {
      date: '2023',
      title: 'SAE 1.04 – Création d\'une base de données',
      company: 'IUT de Blagnac',
      tech: ['Base de données', 'Modélisation', 'SQL'],
      github: '',
      external: '',
      pdf: '/SAE1-04.pdf',
    },
    {
      date: '2022',
      title: 'SAE 15 – Gestion énergétique via capteurs IoT',
      company: 'IUT de Blagnac',
      tech: ['Bash', 'HTML5/CSS3', 'MQTT', 'JSON', 'Linux'],
      github: '',
      external: '',
      pdf: '/BOULOUIHA_Rapport_Technique_SAE_15.docx.pdf',
    },
  ];

  const revealTitle = useRef(null);
  const revealTable = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealTable.current, srConfig(200, 0));
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 10)));
  }, []);

  return (
    <Layout location={location}>
      <Helmet title="Archives" />

      <main>
        <header ref={revealTitle}>
          <h1 className="big-heading">Archives</h1>
          <p className="subtitle">Une liste complète de mes projets universitaires</p>
        </header>

        <StyledTableContainer ref={revealTable}>
          <table>
            <thead>
              <tr>
                <th>Année</th>
                <th>Titre</th>
                <th className="hide-on-mobile">Réalisé à</th>
                <th className="hide-on-mobile">Technologies</th>
                <th>Liens</th>
              </tr>
            </thead>
            <tbody>
              {projectsData.length > 0 &&
                projectsData.map((project, i) => {
                  const { date, github, external, title, tech, company, pdf } = project;
                  return (
                    <tr key={i} ref={el => (revealProjects.current[i] = el)}>
                      <td className="overline year">{`${new Date(date).getFullYear()}`}</td>

                      <td className="title">{title}</td>

                      <td className="company hide-on-mobile">
                        {company ? <span>{company}</span> : <span>—</span>}
                      </td>

                      <td className="tech hide-on-mobile">
                        {tech?.length > 0 &&
                          tech.map((item, i) => (
                            <span key={i}>
                              {item}
                              {''}
                              {i !== tech.length - 1 && <span className="separator">&middot;</span>}
                            </span>
                          ))}
                      </td>

                      <td className="links">
                        <div>
                          {external && (
                            <a
                              href={external}
                              aria-label="Lien externe"
                              target="_blank"
                              rel="noreferrer">
                              <Icon name="External" />
                            </a>
                          )}
                          {github && (
                            <a
                              href={github}
                              aria-label="Lien GitHub"
                              target="_blank"
                              rel="noreferrer">
                              <Icon name="GitHub" />
                            </a>
                          )}
                          {pdf && (
                            <a
                              href={pdf}
                              aria-label="Télécharger le rapport PDF"
                              target="_blank"
                              rel="noreferrer">
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
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </StyledTableContainer>
      </main>
    </Layout>
  );
};

ArchivePage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ArchivePage;
