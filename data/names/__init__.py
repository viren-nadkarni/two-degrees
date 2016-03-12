from os.path import abspath, join, dirname
import random


__title__ = 'names'
__version__ = '0.2'
__author__ = 'Trey Hunner'
__license__ = 'MIT'


full_path = lambda filename: abspath(join(dirname(__file__), filename))


FILES = {
    'first:male': full_path('dist.male.first'),
    'first:female': full_path('dist.female.first'),
    'last': full_path('dist.all.last'),
}


def get_name(filename):
    selected = random.random() * 90
    with open(filename) as name_file:
        for line in name_file:
            name, _, cummulative, _ = line.split()
            if float(cummulative) > selected:
                return name


def get_first_name(gender=None):
    if gender not in ('male', 'female'):
        gender = random.choice(('male', 'female'))
    return get_name(FILES['first:%s' % gender]).capitalize()


def get_last_name():
    return get_name(FILES['last']).capitalize()


def get_full_name(gender=None):
    return u"%s %s" % (get_first_name(gender), get_last_name())


def getIndianName():
    with open(full_path('lastname.txt')) as lastnamesfile:
        lastnames=[]
        for line in lastnamesfile:
            lastnames+=line.split()
    #print lastnames

    with open(full_path('firstname.txt')) as firstnames:
        names=[]
        flag=True

        while True:
            line = firstnames.readline()
            if not line: break
            if flag is True:
                flag= False
                names.append(line.split()[0].split(';')[0])
            else:
                flag=True

        #print names

        name= names[random.randint(0,len(names)-1)] + ' '+ lastnames[random.randint(0, len(lastnames)-1)]
        return name


getIndianName()
