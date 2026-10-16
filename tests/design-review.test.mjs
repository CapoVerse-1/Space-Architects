import test from "node:test";
import assert from "node:assert/strict";
import {
  catalog,
  emptyReview,
  makeExport,
  validateReview,
} from "../src/design-catalog.js";
test("eight stable components each offer four unique selectable variants", () => {
  assert.equal(catalog.length, 8);
  assert.equal(new Set(catalog.map((c) => c.id)).size, 8);
  for (const c of catalog) {
    assert.equal(c.variants.length, 4);
    assert.equal(new Set(c.variants.map((v) => v[0])).size, 4);
  }
});
test("unanswered components are explicit and are never silently preselected", () => {
  const out = makeExport(emptyReview(), "", "2026-10-15T18:00:00Z");
  assert.equal(out.unresolved.length, 8);
  assert.ok(
    out.decisions.every((d) => d.variantId === null && d.variantTitle === null),
  );
  assert.deepEqual(
    validateReview(JSON.parse(JSON.stringify(out))),
    emptyReview(),
  );
});
test("roundtrip preserves all 32 alternatives and Unicode comments exactly", () => {
  for (const c of catalog)
    for (const v of c.variants) {
      const review = emptyReview();
      review[c.id] = {
        variant: v[0],
        note: "Schlicht – „A“ + B.\nZweite Zeile <3",
      };
      assert.deepEqual(
        validateReview(JSON.parse(JSON.stringify(makeExport(review)))),
        review,
      );
    }
});
test("keeping the existing design is a real decision distinct from unanswered", () => {
  const r = emptyReview();
  r.team.variant = "current";
  const out = makeExport(r);
  assert.equal(out.unresolved.length, 7);
  assert.equal(out.decisions[0].variantTitle, "Aktuellen Stand behalten");
  assert.deepEqual(validateReview(out), r);
});
test("unknown schema, component, variant, duplicates and oversized notes are rejected", () => {
  const mutate = (fn) => {
    const value = makeExport(emptyReview());
    fn(value);
    assert.throws(() => validateReview(value));
  };
  mutate((v) => {
    v.schemaVersion = 2;
  });
  mutate((v) => {
    v.project = "other";
  });
  mutate((v) => {
    v.decisions[0].componentId = "unknown";
  });
  mutate((v) => {
    v.decisions[0].variantId = "fake";
  });
  mutate((v) => {
    v.decisions.push(v.decisions[0]);
  });
  mutate((v) => {
    v.decisions[0].note = "x".repeat(5001);
  });
  mutate((v) => {
    v.decisions[0].note = {};
  });
});
test("partial exports restore missing areas as unresolved", () => {
  const out = makeExport(emptyReview());
  out.decisions = [out.decisions[0]];
  assert.deepEqual(validateReview(out), emptyReview());
});
