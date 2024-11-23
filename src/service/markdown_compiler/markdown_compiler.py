import re


def markdown_to_html(request):
    res = request
    res = render_tiele(res)
    res = render_text(res)
    res = render_list(res)
    res = render_link(res)
    res = render_latex(res)

    # Convert paragraphs
    res = re.sub(r'\n\n', r'</p><p>', res)

    # Wrap with paragraph tags if not already wrapped
    if not res.startswith('<p>'):
        res = '<p>' + res + '</p>'

    return res


def render_tiele(req):
    res = req
    res = re.sub(r'###### (.*)', r'<h6>\1</h6>', res)
    res = re.sub(r'##### (.*)', r'<h5>\1</h5>', res)
    res = re.sub(r'#### (.*)', r'<h4>\1</h4>', res)
    res = re.sub(r'### (.*)', r'<h3>\1</h3>', res)
    res = re.sub(r'## (.*)', r'<h2>\1</h2>', res)
    res = re.sub(r'# (.*)', r'<h1>\1</h1>', res)
    return res


def render_text(req):
    res = req

    # Convert bold text
    res = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', res)

    # Convert italic text
    res = re.sub(r'\*(.*?)\*', r'<i>\1</i>', res)

    # Convert strikethrough text
    res = re.sub(r'~~(.*?)~~', r'<del>\1</del>', res)
    return res


def render_list(req):
    res = req
    # Convert unordered lists
    res = re.sub(r'^\* (.*)', r'<ul>\n<li>\1</li>\n</ul>', res, flags=re.MULTILINE)
    res = re.sub(r'^- (.*)', r'<ul>\n<li>\1</li>\n</ul>', res, flags=re.MULTILINE)
    return res


def render_link(req):
    res = req

    # Convert images
    res = re.sub(r'!\[(.*?)\]\((.*?)\)', r'<img src="\2" alt="\1">', res)

    # Convert links
    res = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', res)

    return res

def render_latex(req):
    res = req

    # Convert inline LaTeX equations
    res = re.sub(r'\$(.*?)\$', r'\\(\1\\)', res)

    # Convert LaTeX equations wrapped in double dollar signs
    res = re.sub(r'\$\$(.*?)\$\$', r'\\[\1\\]', res)

    return res