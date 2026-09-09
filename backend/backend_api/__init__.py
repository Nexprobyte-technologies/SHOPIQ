"""Compat: fix Django template Context copying on Python 3.13+.

Django <=5.1's BaseContext.__copy__ relied on copy.copy(super()), which
returns the identical immutable super proxy on Python 3.13+, breaking every
admin changelist render. Uses Django main's fixed implementation instead.
"""
import copy as _copy

from django.template import context as _template_context


def _base_context_copy(self):
    duplicate = _template_context.BaseContext()
    duplicate.__class__ = self.__class__
    duplicate.__dict__ = _copy.copy(self.__dict__)
    duplicate.dicts = self.dicts[:]
    return duplicate


_template_context.BaseContext.__copy__ = _base_context_copy