import * as mfs from './lib/filesystem.js';
import * as config from './local-config.js';

export default function parser(doc) {
  const wordCount = doc.wordCount();
  let parseCount = 0;
  let parseTakeActionCount = 0;
  const timestamp1 = new Date().getTime();

  // Relationship rules
  function loadRelationRules(file) {
    const rulesPath = './rules/periodic-parser/';
    const fileType = '.json';
    const filePath = rulesPath + file + fileType;
    const rules = [];
    const rulesData = JSON.parse(mfs.loadJSONFile(filePath));

    Object.values(rulesData).forEach((rule) => {
      rules.push(rule);
    });

    return rules;
  }

  const periodicRules = loadRelationRules('periodic-parser');

  function tagMatch(sentence, rule) {
    parseCount++;
    let tookAction = false;

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
        parseTakeActionCount++;
        tookAction = true;

        const matchedPattern = sentence.match(pattern);

        console.log('!!!!!!!!!!!!!!!!!!!!!!!');
        console.log(`${config.terminal.bright}Batch:${config.terminal.reset} ${rule.batch} : ${config.terminal.bright}Order#${config.terminal.reset} ${rule.order}`);
        console.log(`${config.terminal.bright}Rule:${config.terminal.reset} ${JSON.stringify(rule)}`);
        console.log(`${config.terminal.bright}Pattern:${config.terminal.reset} ${JSON.stringify(pattern)}`);
        console.log(`${config.terminal.bright}Matched Pattern:${config.terminal.reset} ${matchedPattern.text()}`);

        if (tag) console.log(`${config.terminal.bright}Tag:${config.terminal.reset} ${JSON.stringify(tag)}`);
        if (untag) console.log(`${config.terminal.bright}Untag:${config.terminal.reset} ${JSON.stringify(untag)}`);
        if (demark) console.log(`${config.terminal.bright}Demark:${config.terminal.reset} ${JSON.stringify(demark)}`);
        if (replace) console.log(`${config.terminal.bright}Replace:${config.terminal.reset} ${JSON.stringify(replace)}`);
        if (modifier) console.log(`${config.terminal.bright}Modifier:${config.terminal.reset} ${JSON.stringify(modifier)}`);
        console.log('!!!!!!!!!!!!!!!!!!!!!!!\n\n');

        if (modifier) {
          const terms = matchedPattern.match(modifier.term);
          const modifies = matchedPattern.match(modifier.modifies);

          let termTag = 'Modifies';
          if (modifier.termTag) {
            termTag = modifier.termTag;
          }

          terms.forEach((term, i) => {
            let modTag = modifies.eq(i).text();
            modTag = modTag.replace(/ /g, '-');
            modTag = `${termTag}:${modTag}`;

            const adjTerm = term.not(modifies);
            adjTerm.tag(modTag);
          });
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
    return tookAction;
  }

  function clearPOSRoles(sentence) {
    sentence.terms().forEach((term) => {
      let tags = term.json({
        text: false, terms: { text: false, tags: true, whitespace: false },
      })[0].terms;
      tags = tags[0].tags;

      let role = 'none';
      tags = tags.filter((tag) => (
        tag === 'Nn' || tag === 'Vb' || tag === 'Aj' || tag === 'Av'
        || tag === 'Vl' || tag === 'Iv' || tag === 'Gd' || tag === 'Pt'
        || tag === 'Pp' || tag === 'Sbj' || tag === 'Dobj' || tag === 'Iobj'
        || tag === 'Pred' || tag === 'Subcls' || tag === 'Relcls' || tag === 'Final'
      ));

      role = tags[tags.length - 1];
      tags.forEach((tag) => {
        term.untag(tag);
      });
      term.tag(role);
    });
  }

  function parseRule(sentence, rule) {
    let tookAction = false;
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
        tookAction = tagMatch(chunk, rule);
      });
    } else {
      tookAction = tagMatch(sentence, rule);
    }
    return tookAction;
  }

  function relationships(sentence) {
    let tookAction = false;
    periodicRules.forEach((rule) => {
      clearPOSRoles(sentence);
      tookAction = parseRule(sentence, rule);
    });
    return tookAction;
  }

  // Load the parsing rules and sort them by batch and within batch.
  // Rule order is critical for correct assignments.
  const posPath = './rules/sequencial-parser/';
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
      const tookAction = parseRule(sentence, rule);
      console.log(`Batch: ${rule.batchOrder} Order: ${rule.order}`);
      console.log(tookAction);
      if (tookAction && (rule.batch !== 'Clean Up')) {
        relationships(sentence);
      }
    });

    console.log('Sentence post parser:\n');
    console.log(sentence.text());
    console.log(sentence.debug());
    console.log(`Word Count = ${wordCount}`);
    console.log(`Parse Count = ${parseCount}`);
    console.log(`Parse Actions = ${parseTakeActionCount}`);
    console.log(`\nParses per word = ${parseCount / wordCount}`);
    console.log(`Actions per word = ${parseTakeActionCount / wordCount}`);
    console.log(`Parses per Action = ${parseCount / parseTakeActionCount}`);
    const timestamp2 = new Date().getTime();
    const duration = timestamp2 - timestamp1;
    const seconds = duration / 1000;
    console.log(`Run Time: ${seconds} seconds\n`);
  });
}
