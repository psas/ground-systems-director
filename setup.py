#!/usr/bin/env python
# -*- coding: utf-8 -*-


try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup


with open('README.rst') as readme_file:
    readme = readme_file.read()

with open('HISTORY.rst') as history_file:
    history = history_file.read().replace('.. :changelog:', '')

requirements = [
    # TODO: put package requirements here
]

test_requirements = [
    # TODO: put package test requirements here
]

setup(
    name='psas_services',
    version='0.1.0',
    description="A network service manager for the PSAS launch infrastructure.",
    long_description=readme + '\n\n' + history,
    author="Portland State Aerospace Society",
    author_email='info@psas.pdx.edu',
    url='https://github.com/psas/ground-systems-director',
    packages=[
        'psas_services',
    ],
    package_dir={'psas_services':
                 'psas_services'},
    include_package_data=True,
    install_requires=requirements,
    license="GNU GPL v3.0",
    zip_safe=False,
    keywords='psas_services',
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Intended Audience :: Developers',
        'Environment :: Console',
        'License :: OSI Approved :: GNU General Public License v3 (GPLv3)',
        'License :: OSI Approved :: BSD License',
        'Natural Language :: English',
        'Programming Language :: Python :: 3 :: Only',
        'Programming Language :: Python :: 3.4',
        'Topic :: System :: Monitoring',
    ],
    test_suite='tests',
    tests_require=test_requirements
)
