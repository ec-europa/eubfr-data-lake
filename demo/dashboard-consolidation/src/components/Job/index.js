import React from 'react';

const Job = ({ job }) => {
  const { _source: task } = job;
  console.log(task);
  const a = {
    'JAVA JOB RESULT ':
      '{"_id":{"budget":600000},"count":65,"projects":["edef7cc854282f3a9e62533cbcc9ea7a","d9b4bc8c3235e3c71b0d81eb7ed1133f","f2409d664a8fdc200b6b06e5b7aacd2a","9e364002358f5cd442ec65b839fe3b7d","305b3962408bfd33807b21c695eb4f93","669a1abe03df52b357c9a35191f3b9eb","3fdb3d5dfbae1664d80671d1c6af1718","b64a1d822b899884f79d0523f9c8211e","d0b03c4b0b6b3e79ccfa0527525626e9","e23a6d5bf4bb40cafeb75259b5508be9","e7d276a230f1a1c69438685c4257095c","9cf0d8466f0d89f61995cd3563b7cb07","d951ba80d2ac865da90a9edf838f9618","24ab44e77556c2e68529233aa1b36422","30e65d4632985dc82a5f86ed839e484c","b54d7b250cc792b459053b24b0b446cc","f84b2a71b9f512a0a2a194b85a4603be","b2aa9d5b47ff3afa2ce0eaf42997984f","4c6c1c91753c8b5de99f376e82593720","2ce3f8f30a0c4c1f2b43813f547e2c2d","d308667476c6d2b2a8e6cdcea8510593","2b068fd86727a42d9f1df25ace1c2941","5b9f0b7a5e08757efe9d21eb2bf533d8","6a74990716d7a3de2e4c909d0be2ca6a","48d6e6bdcd01aea888f0cb6df0e911d0","bdffb0c71409a09abe45a7db0f31f82b","8eaaa22ee5c48c56611b973d037d3db0","a7e219a49b3df47bd0ea832dfad33ac4","40fc127aef65c3122dac516e740c1f9e","8b1c0527804bef7389462195cf874b11","5d8c24b3bf4b93a47f0c135ca6875e58","9d77a57341151915e5e0ef81373bd768","4f56bf7b45a7e354db6f43977f5dd065","0af18597e38400f6ebad6e5d0afd6acb","fd09e35d798cce8af526dc134059c31e","796f487c8df6f7176b3f9efe9410a52a","ab8e7279c1a83a7f79192ce6c326f6f3","e4e6b885f5327d0ad034214d168b3125","7d725e60114c0688c1c201232e9cd3da","0d28f4f3cfee803c312f97ecdd9c84a8","03621f8a46eee4d3fa1682a245785935","1d937fc0f3533bd248cb3f3a9215d813","ac1edad87bf433e70a1c8fd6f994e64f","12439a7a3e799c2d3b4cfda4d6cc2993","18b760bf2caa9d551cdfefaab635ca0f","ab64b1878fed2dff6493fca2775336e2","0973c386119621d82a6fca0fab76e5c8","faf43e4c0343dc915294da02ca986799","a73acaeacb649c4521df21250bc38154","8a34e345fc9e7921cd95765302114b8c","dc3646965aa11cac677b4da9f78d29d7","0c6e13a556f15afe0ce9a93a018b1837","0b9c9ca6991956bc4c9414146d1d5f3a","a5daeffc07ab4b12203b7e38d68ad2eb","e2dfdffe91b4c5b0d25f3277f2949ae7","a15301cbff9cff3726feae289ccd1371","a889500129352d2d30bced5b9277e74a","ecc67ac31d368c9cbbce81172935d9ef","ffbca94767af7887febb26630173ebbf","db81cea2c7f0a19eb9f9c147bf8cd4e0","0c324e4cb72a3fbb5953fef24c67706d","59d52fd8a6acd1f8c52670492a35fda8","ac2b76920d978bd8a4f7ce84702ac4f9","b56fa3bbad8812b8f2152529c089289f","2aedc8a4e7349cd487fccc03325574e0"]}',
    'CONTAINS DUPLICATES ?': 'YES',
    'KIBANA LINKS TO SAVED SEARCHES':
      '"600000" AND title:"Failure analysis and damage mechanisms of newly developed, gamma-prime strengthened Ni - based superalloy" : https://search-test-public-ip4o6f4o6ziykrbjm4kdpyosfu.eu-central-1.es.amazonaws.com/_plugin/kibana/app/kibana#/discover/fc2474d0-3362-11e9-80f1-0fdac1e24ebe?_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow-5y%2Cmode%3Aquick%2Cto%3Anow))\r\n\r\n\r\n"600000" AND title:"Development of super-wheat crops by introgressing agronomic traits from related wild species" : https://search-test-public-ip4o6f4o6ziykrbjm4kdpyosfu.eu-central-1.es.amazonaws.com/_plugin/kibana/app/kibana#/discover/15da07a0-3363-11e9-80f1-0fdac1e24ebe?_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow-5y%2Cmode%3Aquick%2Cto%3Anow))\r\n\r\n"600000" AND title:"Wing Dynamics Acceleration Sensor" :\r\nhttps://search-test-public-ip4o6f4o6ziykrbjm4kdpyosfu.eu-central-1.es.amazonaws.com/_plugin/kibana/app/kibana#/discover/37c50b30-3363-11e9-80f1-0fdac1e24ebe?_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow-5y%2Cmode%3Aquick%2Cto%3Anow))',
    'SAME JSON? (computed key)': 'NO',
  };
  const hasDuplicates = task['CONTAINS DUPLICATES ?'];
  const sameComputedKey = task['SAME JSON? (computed key)'];
  const o = JSON.parse(task['JAVA JOB RESULT ']);
  const { count, _id } = o;

  return (
    <div className="ecl-col-sm-12 ecl-col-md-4">
      <article className="ecl-card">
        <header className="ecl-card__header">
          <div className="ecl-card__meta">Projects: {count}</div>
          <h1 className="ecl-card__title">
            <a
              level="1"
              href="/example"
              className="ecl-link ecl-link--standalone"
            >
              {JSON.stringify(_id)}
            </a>
          </h1>
        </header>
        <footer className="ecl-card__footer">
          <ul className="ecl-card__info-container">
            <li className="ecl-card__info-item">
              Has duplicates: {hasDuplicates}
            </li>
            <li className="ecl-card__info-item">
              Has same computed_key: {sameComputedKey}
            </li>
          </ul>
        </footer>
      </article>
    </div>
  );
};

export default Job;
