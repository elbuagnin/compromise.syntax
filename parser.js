import * as mfs from './lib/filesystem.js';

export default function parser(doc) {
  // Relationship rules
  function loadRelationRules(file) {
    const rulesPath = './rules/relation-parser/';
    const fileType = '.json';
    const filePath = rulesPath + file + fileType;
    const rules = [];
    const rulesData = JSON.parse(mfs.loadJSONFile(filePath));

    Object.values(rulesData).forEach((rule) => {
      rules.push(rule);
    });

    return rules;
  }

  const nominalRules = loadRelationRules('nominals');
  const verbialRules = loadRelationRules('verbials');
  const modifierRules = loadRelationRules('modifiers');
  const verbalRules = loadRelationRules('verbals');
  const prepositionalRules = loadRelationRules('prepositional');

  function tagMatch(sentence, rule) {
    const {
      pattern, tag, untag, demark, tagID, replace, modifier,
    } = rule;

    function remove(removeTerm, removeTag) {
      if (typeof removeTag === 'string') {
        if (removeTerm.match(removeTag).found) {
          removeTerm.untag(removeTag);
        }
      } else if (removeTag.constructor === Array) {
        removeTag.forEach((oneTag) => {
          if (removeTerm.match(oneTag).found) {
            removeTerm.untag(oneTag);
          }
        });
      }
    }

    if (pattern) {
      if (sentence.has(pattern)) {
        const matchedPattern = sentence.match(pattern);

        console.log('we have a match:\n');
        console.log(JSON.stringify(rule));
        console.log('\n');
        console.log(matchedPattern.text());
        console.log('\n');
        console.log(`${('Tag: ' && JSON.stringify(tag)) || ''}\n${('Untag: ' && JSON.stringify(untag)) || ''}\n${('Demark: ' && JSON.stringify(demark)) || ''}\n${('Replace: ' && JSON.stringify(replace)) || ''}\n${('Modifier: ' && JSON.stringify(modifier)) || ''}`);
        console.log('\n');

        if (modifier) {
          let term = matchedPattern.match(modifier.term);
          const modifies = matchedPattern.match(modifier.modifies);

          let termTag = 'Modifies';
          if (modifier.termTag) {
            termTag = modifier.termTag;
          }

          let modTag = modifies.text();
          modTag = modTag.replace(/ /g, '-');
          modTag = `${termTag}:${modTag}`;
          console.log(`Term: ${JSON.stringify(term)}`);
          console.log(`Modifies(pre): ${JSON.stringify(modifies)}`);

          term = term.not(modifies);

          console.log(modifies.match(term));
          if (modifies.match(term).found || term.match(modifies).found) {
            console.log('Tagging undefined terms. Skipping tagging.');
          } else {
            term.tag(modTag);
          }
        }

        if (tag) {
          if (tag.on) {
            const matchedTerm = matchedPattern.match(tag.on.term);
            matchedTerm.tag(tag.on.termTag);
          }

          if (tag.split) {
            const beforeTerm = matchedPattern.before(tag.split.term);
            beforeTerm.tag(tag.split.termTag);
            const afterTerm = matchedPattern.after(tag.split.term);
            afterTerm.tag(tag.split.termTag);
          }

          if (tag.before) {
            const matchedTerm = matchedPattern.before(tag.before.term);
            matchedTerm.tag(tag.before.termTag);
          }

          if (tag.after) {
            const matchedTerm = matchedPattern.after(tag.after.term);
            matchedTerm.tag(tag.after.termTag);
          }

          if (tag.beginning) {
            matchedPattern.firstTerms().tag(tag.beginning);
          }

          if (tag.ending) {
            matchedPattern.lastTerms().tag(tag.ending);
          }

          if (tag.first) {
            const matchedTerm = matchedPattern.match(tag.first.term).first();
            matchedTerm.tag(tag.first.termTag);
          }

          if (tag.last) {
            const matchedTerm = matchedPattern.match(tag.last.term).last();
            matchedTerm.tag(tag.last.termTag);
          }

          if (tag.each) {
            tag.each.forEach((item) => {
              const { term } = item;
              const { termTag } = item;
              const matchedTerm = matchedPattern.match(term);

              matchedTerm.tag(termTag);
            });
          }

          if (tag.eachTheSame) {
            tag.eachTheSame.terms.forEach((term) => {
              const matchedTerm = matchedPattern.match(term);
              matchedTerm.tag(tag.eachTheSame.termTag);
            });
          }
          if (tag.all) {
            matchedPattern.tag(tag.all);
          }
        }

        if (tagID) {
          if (tagID.on) {
            const matchedTerm = matchedPattern.match(tagID.on.term);
            matchedTerm.tagWithID(tagID.on.termTag);
          }

          if (tagID.split) {
            const beforeTerm = matchedPattern.before(tagID.split.term);
            beforeTerm.tagWithID(tagID.split.termTag);
            const afterTerm = matchedPattern.after(tagID.split.term);
            afterTerm.tagWithID(tagID.split.termTag);
          }

          if (tagID.before) {
            const matchedTerm = matchedPattern.before(tagID.before.term);
            matchedTerm.tagWithID(tagID.before.termTag);
          }

          if (tagID.after) {
            const matchedTerm = matchedPattern.after(tagID.after.term);
            matchedTerm.tagWithID(tagID.after.termTag);
          }

          if (tagID.first) {
            const matchedTerm = matchedPattern.match(tagID.first.term).first();
            matchedTerm.tagWithID(tag.first.termTag);
          }

          if (tagID.last) {
            const matchedTerm = matchedPattern.match(tagID.last.term).last();
            matchedTerm.tagWithID(tag.last.termTag);
          }

          if (tagID.beginning) {
            matchedPattern.firstTerms().tagWithID(tagID.beginning);
          }

          if (tagID.ending) {
            matchedPattern.lastTerms().tagWithID(tagID.ending);
          }

          if (tagID.each) {
            tagID.each.forEach((item) => {
              const { term } = item;
              const { termTag } = item;
              const matchedTerm = matchedPattern.match(term);

              matchedTerm.tagWithID(termTag);
            });
          }

          if (tagID.eachTheSame) {
            tagID.eachTheSame.terms.forEach((term) => {
              const matchedTerm = matchedPattern.match(term);
              matchedTerm.tagWithID(tagID.eachTheSame.termTag);
            });
          }
          if (tagID.all) {
            matchedPattern.tagWithID(tagID.all);
          }
        }

        if (demark) {
          if (demark.on) {
            const matchedTerm = matchedPattern.match(demark.on.term);
            matchedTerm.tag(demark.on.termTag);
          }
          if (demark.eachTheSame) {
            demark.eachTheSame.terms.forEach((term) => {
              const matchedTerm = matchedPattern.match(term);
              matchedTerm.tag(demark.eachTheSame.termTag);
            });
          }
          if (demark.beginning) {
            matchedPattern.firstTerms().tag(demark.beginning);
          }
          if (demark.ending) {
            matchedPattern.lastTerms().tag(demark.ending);
          }
        }

        if (replace) {
          if (replace.on) {
            const matchedTerm = matchedPattern.match(replace.on.term);
            remove(matchedTerm, replace.on.termUnTag);
            matchedTerm.tag(replace.on.termTag);
          }
          if (replace.first) {
            const matchedTerm = matchedPattern.match(replace.first.term).first();
            remove(matchedTerm, replace.first.termUnTag);
            matchedTerm.tag(replace.first.termTag);
          }
          if (replace.last) {
            const matchedTerm = matchedPattern.match(replace.last.term).last();
            remove(matchedTerm, replace.last.termUnTag);
            matchedTerm.tag(replace.last.termTag);
          }
          if (replace.beginning) {
            const matchedTerm = matchedPattern.firstTerms();
            remove(matchedTerm, replace.beginning.termUnTag);
            matchedTerm.tag(replace.beginning.termTag);
          }
          if (replace.ending) {
            const matchedTerm = matchedPattern.lastTerms();
            remove(matchedTerm, replace.ending.termUnTag);
            matchedTerm.tag(replace.ending.termTag);
          }
        }

        if (untag) {
          if (untag.on) {
            const matchedTerm = matchedPattern.match(untag.on.term);
            remove(matchedTerm, untag.on.termUnTag);
          }
          if (untag.beginning) {
            const matchedTerm = matchedPattern.firstTerms();
            remove(matchedTerm, untag.beginning);
          }
          if (untag.ending) {
            const matchedTerm = matchedPattern.lastTerms();
            remove(matchedTerm, untag.ending);
          }
          if (untag.each) {
            untag.each.forEach((item) => {
              const { term } = item;
              const { termUnTag } = item;
              const matchedTerm = matchedPattern.match(term);
              remove(matchedTerm, termUnTag);
            });
          }
          if (untag.all) {
            remove(matchedPattern, untag.all);
          }
        }

        console.log(sentence.debug());
        console.log('\n\n');
      }
    }
  }

  function arrayCompare(arr1, arr2) {
    if (arr1.toString() === arr2.toString()) {
      return true;
    }
    return false;
  }

  function differentElements(arr1, arr2) {
    const changes = [];
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        changes.push(arr2[i]);
      } else {
        changes.push('same');
      }
    }

    return changes;
  }

  function getPosRoles(sentence, clearOld = false) {
    const roles = [];
    sentence.terms().forEach((term) => {
      let tags = term.json({
        text: false, terms: { text: false, tags: true, whitespace: false },
      })[0].terms;
      console.log(JSON.stringify(`{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}${tags}`));
      tags = tags[0].tags;
      console.log(JSON.stringify(`}}}}}}}}}}}}}}}}}}}${tags}`));

      let role = 'none';
      tags = tags.filter((tag) => (
        tag === 'Nn' || tag === 'Vb' || tag === 'Aj' || tag === 'Av'
        || tag === 'Vl' || tag === 'Iv' || tag === 'Gd' || tag === 'Pt'
        || tag === 'Pp'
      ));
      console.log(`${term.text()}^^^^^^^^^^^^^^^^^^^^${tags}`);
      role = tags[tags.length - 1];

      roles.push(role);

      if (clearOld === true) {
        tags.forEach((tag) => {
          console.log(`+++++++++++++++++++++++++ ${term.text()}: ${tag}`);
          term.untag(tag);
        });
        term.tag(role);
      }
    });

    return roles;
  }

  function parseRule(sentence, rule) {
    console.log(`@#@#@#@#@# ${rule.batch} : #${rule.order} @#@#@#@#@#@`);
    if (rule.type === 'intra-phrase') {
      let chunks = sentence;
      if (sentence.has('#Comma')) {
        const commas = sentence.match('#Comma');
        commas.forEach((comma) => {
          if (comma.ifNo('(#List|#CoordinatingAdjectives)').found) {
            chunks = chunks.splitAfter(comma);
          }
        });
      }
      chunks.forEach((chunk) => {
        tagMatch(chunk, rule);
      });
    } else {
      tagMatch(sentence, rule);
    }
  }

  function relationships(sentence, changes) {
    function check(rules) {
      rules.forEach((rule) => {
        const clearOld = true;
        getPosRoles(sentence, clearOld);
        parseRule(sentence, rule);
      });
    }

    changes.forEach((change) => {
      switch (change) {
        case 'Nn':
          check(nominalRules);
          break;
        case 'Vb':
          check(verbialRules);
          break;
        case 'Aj' || 'Av':
          check(modifierRules);
          break;
        case 'Vl' || 'Iv' || 'Gd' || 'Pt':
          check(verbalRules);
          break;
        case 'Pp':
          check(prepositionalRules);
          break;
        default:
          break;
      }
    });
  }

  // Load the parsing rules and sort them by batch and within batch.
  // Rule order is critical for correct assignments.
  const posPath = './rules/pos-parser/';
  const list = true;
  const ruleSets = mfs.loadJSONDir(posPath, list);
  const orderedRules = [];
  Object.values(ruleSets).forEach((ruleSet) => {
    Object.values(ruleSet).forEach((rule) => {
      orderedRules.push(rule);
    });
  });

  orderedRules.sort((a, b) => a.batchOrder - b.batchOrder || a.order - b.order);

  // Process the document by sentences and then by non-list commas for intra-phrase...
  // Process by entire sentence for inter-phrase.
  const sentences = doc.sentences();
  sentences.forEach((sentence) => {
    console.log('------------------------------------------------------------');
    console.log('Sentence after pre-parser:\n');
    console.log(sentence.text());
    console.log(sentence.debug());

    orderedRules.forEach((rule) => {
      const clearOld = true;
      const rolesBefore = getPosRoles(sentence, clearOld);

      parseRule(sentence, rule);

      const rolesAfter = getPosRoles(sentence);

      if (arrayCompare(rolesBefore, rolesAfter) === false) {
        const changedElements = differentElements(rolesBefore, rolesAfter);
        console.log('Checking relationships of changed elements.');
        relationships(sentence, changedElements);
        console.log(changedElements);
        console.log(rolesBefore);
        console.log(rolesAfter);
      }
    });

    console.log('Sentence post parser:\n');
    console.log(sentence.text());
    console.log(sentence.debug());
  });
}
