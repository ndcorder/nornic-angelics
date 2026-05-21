/**
 * Annotation interaction layer for the Committee on Elegiac Standards.
 * Handles click-to-expand, visual escalation, and the final revelation.
 */
(function () {
    'use strict';

    const annotations = document.querySelectorAll('.annotation');
    const finalAnnotation = document.getElementById('final-annotation');
    const readSet = new Set();
    const totalAnnotations = annotations.length;

    /**
     * Toggle an annotation's expanded state.
     * Opening marks it as read; closing leaves it marked.
     */
    function toggleAnnotation(annotation) {
        const index = annotation.dataset.index;
        const isOpen = annotation.classList.contains('open');

        if (isOpen) {
            annotation.classList.remove('open');
        } else {
            annotation.classList.add('open');
            markRead(index);
        }
    }

    /**
     * Record an annotation as read and update the page atmosphere.
     * Triggers the final revelation when all annotations have been read.
     */
    function markRead(index) {
        if (readSet.has(index)) return;
        readSet.add(index);

        updateDocumentAtmosphere();

        if (readSet.size >= totalAnnotations) {
            triggerFinalRevelation();
        }
    }

    /**
     * Progressively warm and darken the background as more
     * annotations are read — invisible in isolation, cumulative
     * in effect.
     */
    function updateDocumentAtmosphere() {
        var progress = readSet.size / totalAnnotations;

        // Start: rgb(250, 248, 245)  — cool parchment
        // End:   rgb(245, 237, 230)  — warmed, aged
        var r = Math.round(250 - (5 * progress));
        var g = Math.round(248 - (11 * progress));
        var b = Math.round(245 - (15 * progress));

        var color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
        document.getElementById('document').style.background = color;
        document.body.style.background = color;
    }

    /**
     * After a stillness delay, reveal the final annotation
     * and scroll it into view.
     */
    function triggerFinalRevelation() {
        setTimeout(function () {
            if (!finalAnnotation) return;

            finalAnnotation.classList.add('visible');

            setTimeout(function () {
                finalAnnotation.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 800);
        }, 1500);
    }

    // Bind click and keyboard events to each annotation
    annotations.forEach(function (annotation) {
        annotation.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleAnnotation(annotation);
        });

        annotation.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAnnotation(annotation);
            }
        });
    });

    // Collapse all annotations when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.annotation')) {
            annotations.forEach(function (a) {
                a.classList.remove('open');
            });
        }
    });
})();
