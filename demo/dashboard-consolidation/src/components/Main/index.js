import React from 'react';

const Main = () => (
  <main className="ecl-u-pv-xl">
    <div className="ecl-container">
      <div className="ecl-row ecl-u-mt-l">
        <div className="ecl-col-sm-12 ecl-col-md-4">
          <article className="ecl-card">
            <header className="ecl-card__header">
              <div className="ecl-card__image" alt="card image" />
              <div className="ecl-card__meta">Meta1 | Meta2</div>
              <h1 className="ecl-card__title">
                <a
                  level="1"
                  href="/example"
                  className="ecl-link ecl-link--standalone"
                >
                  Better regulation
                </a>
              </h1>
            </header>
            <section className="ecl-card__body">
              <div className="ecl-card__description">
                Transparently designing and evaluating evidence-based EU
                legislation, backed by citizens views.
              </div>
            </section>
            <footer className="ecl-card__footer">
              <ul className="ecl-card__info-container">
                <li className="ecl-card__info-item">
                  <span className="ecl-card__info-label">2018/10/22</span>
                </li>
                <li className="ecl-card__info-item">
                  <span className="ecl-card__info-label">Luxembourg</span>
                </li>
              </ul>
              <ul className="ecl-card__tag-container">
                <li className="ecl-card__tag-item">
                  <a href="/example" className="ecl-card__tag ecl-tag">
                    tag 1
                  </a>
                </li>
                <li className="ecl-card__tag-item">
                  <a href="/example" className="ecl-card__tag ecl-tag">
                    tag 2
                  </a>
                </li>
                <li className="ecl-card__tag-item">
                  <a href="/example" className="ecl-card__tag ecl-tag">
                    tag 3
                  </a>
                </li>
              </ul>
            </footer>
          </article>
        </div>
      </div>
    </div>
  </main>
);

export default Main;
