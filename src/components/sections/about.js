import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;

const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      outline: 0;
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 14px;
      left: 14px;
      z-index: -1;
    }
  }

  .languages {
    margin-top: 50px;

    h3 {
      color: var(--green);
      font-size: var(--fz-lg);
      margin-bottom: 15px;
      font-weight: 600;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        position: relative;
        margin-bottom: 8px;
        padding-left: 20px;
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        color: var(--light-slate);

        &:before {
          content: '▹';
          position: absolute;
          left: 0;
          color: var(--green);
          font-size: var(--fz-sm);
          line-height: 12px;
        }

        strong {
          color: var(--lightest-slate);
        }
      }
    }
  }

  .certifications {
    margin-top: 30px;

    h3 {
      color: var(--green);
      font-size: var(--fz-lg);
      margin-bottom: 15px;
      font-weight: 600;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        position: relative;
        margin-bottom: 10px;
        padding-left: 20px;
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        color: var(--light-slate);

        &:before {
          content: '▹';
          position: absolute;
          left: 0;
          color: var(--green);
          font-size: var(--fz-sm);
          line-height: 12px;
        }

        strong {
          color: var(--lightest-slate);
        }

        a {
          ${({ theme }) => theme.mixins.inlineLink};
          color: var(--lightest-slate);
          text-decoration: none;

          &:hover {
            color: var(--green);
          }
        }
      }
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skills = [
    'React',
    'Angular',
    'TypeScript',
    'Vue.js',
    'JavaScript ES6+',
    'Docker',
    'Blender API',
    'Python',
    'Java',
    'PHP',
    'Oracle PLSQL',
    'Linux/Unix',
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">À propos</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Bonjour ! Passionné par le développement logiciel, la cybersecurité et les nouvelles
              technologies, j'aime explorer les possibilités créatives qu'offre l'informatique
              moderne et transformer des idées en solutions concrètes.
            </p>

            <p>
              Ma passion pour la programmation a commencé à 16 ans en développant des addons pour
              GarrysMod. J'adorais voir mes idées prendre forme, ce qui m'a motivé à m'orienter vers
              l'informatique et découvrir les multiples possibilités du monde numérique de demain.
            </p>

            <p>
              Mon parcours du BUT R&T (Cybersécurité et IoT) au BUT Informatique (Développement
              d'applications) m'a donné une vision complète des systèmes, de l'infrastructure réseau
              au développement d'applications.
            </p>

            <p>Voici quelques technologies avec lesquelles j'ai travaillé récemment :</p>
          </div>

          <ul className="skills-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/me.png"
              width={500}
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Photo de profil"
            />
          </div>

          <div className="languages">
            <h3>Langues</h3>
            <ul>
              <li>
                <strong>Espagnol</strong> Natif
              </li>
              <li>
                <strong>Français</strong> Courant
              </li>
              <li>
                <strong>Anglais</strong> C1 avancé
              </li>
              <li>
                <strong>Arabe</strong> Dialectal
              </li>
            </ul>
          </div>

          <div className="certifications">
            <h3>Certifications</h3>
            <ul>
              <li>
                <a href="/CCNA.pdf" target="_blank" rel="noreferrer">
                  <strong>Cisco CCNA</strong>
                </a>{' '}
                - Cisco Certified Network Associate, certification validant les compétences
                fondamentales en réseaux et sécurité
              </li>
            </ul>
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
