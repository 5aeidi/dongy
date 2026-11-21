import { LegalPage } from './legal-page'

export default function ImprintPage() {
  return (
    <LegalPage title="Project notice">
      <p>
        DONGY is a non-commercial, community-maintained software project
        developed in public through the DONGY GitHub repository.
      </p>

      <section>
        <h3>Project and source code</h3>
        <p>
          The project is maintained by community contributors. Its source code,
          issue tracker, and contributor information are available at{' '}
          <a
            href="https://github.com/5aeidi/dongy"
            target="_blank"
            rel="noreferrer"
          >
            github.com/5aeidi/dongy
          </a>
          .
        </p>
      </section>

      <section>
        <h3>Contact</h3>
        <p>
          For privacy, legal, or project-related questions, email{' '}
          <a href="mailto:privacy@spliit.cloud">privacy@spliit.cloud</a>.
        </p>
      </section>

      <section>
        <h3>Non-commercial project</h3>
        <p>
          DONGY is not offered by a registered business or company. This page
          identifies the project and its public contact channel; it does not
          create a commercial service relationship.
        </p>
      </section>
    </LegalPage>
  )
}
