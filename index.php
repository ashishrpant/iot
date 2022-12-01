<?php

header('Access-Control-Allow-Origin: *');

session_start();
$CID = $_SESSION['operator'];

if ($CID == NULL) {
	echo '<script>window.location.href = "/";</script>';
}
$UserFirstName = $_SESSION['useraccessfirstname'];
$UserLastName = $_SESSION['useraccesslastname'];
$UserName = $UserFirstName . " " . $UserLastName;
$UserWorkgroup = $_SESSION['userworkgroup'];

if (file_exists("../../operator_map.php")) {
	include_once("../../operator_map.php");
}
$override_disp = '';
if ($operator_map) {
	$override_disp   = array_search($CID, $operator_map);
}
if ($override_disp == '') {
	$override_disp  = $CID;
}

/**
 * Dev mnt
 */
$fleetpoint = $_GET['fleetpoint'];
$siteId     = $_GET['siteId'];

$userlevels = array('IFBASEDEV', 'IFBASE', 'IFBASE2', 'IFBRBE', 'IFBSALES');

$useraccess = $_SESSION["useraccessok"];
$userok = explode("-", $useraccess);
$user = strtoupper(trim($userok[0]));

if(in_array($user, $userlevels)) {
    $usertype = "admin";
} else {
    $usertype = "customer";
}

?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>PDI Intellifuel Menu</title>
	<script src="/bin/iot/libraries/js/jquery-3.5.1.min.js"></script>
	<script src="/bin/iot/libraries/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" type="text/css" href="/bin/iot/libraries/css/dataTables.bootstrap4.min.css"/>
	<link rel="stylesheet" type="text/css" href="/bin/iot/libraries/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="/bin/iot/libraries/css/font-awesome.min.css">
	<link type="text/css" href="/bin/iot/libraries/css/overlay.css?v=<?php echo time() ?>" rel="stylesheet"/>
	<meta name="cid" content="<?php echo $_SESSION["operator"]; ?>">

	<title>Data Capture</title>
</head>
<body>
<?php require("/var/www/htdocs/base/bin/base/new_menu.php"); ?>

<div class="col-12" id="mainContainer">
	<div id="mainContent"></div>
    <div id="hiddenspin_new" align="center" style="display: none">
        <div id="hiddenspin">
            <div class="hiddenspiner"></div>
        </div>

    </div>

</div>
<?php
/**
 * IF-5439
 * Including datatables
 */
?>
<script src="/bin/iot/libraries/js/jquery.dataTables.min.js"></script>
<script src="/bin/iot/libraries/js/dataTables.bootstrap4.min.js"></script>
<script src="r/js/class/DataCapture.js?time=<?php echo time() ?>"></script>
<script src="r/js/class/Render.js?time=<?php echo time() ?>"></script>
<script src="r/js/class/Actions.js?time=<?php echo time() ?>"></script>
<script src="/bin/iot/libraries/js-classes/ButtonAction.js?time=<?php echo time() ?>"></script>
<script src="/bin/iot/libraries/js-classes/Message.js?time=<?php echo time() ?>"></script>
<script src="/bin/iot/libraries/js-classes/Elements.js?time=<?php echo time() ?>"></script>
<script src="/bin/iot/libraries/js-classes/Links.js?time=<?php echo time() ?>"></script>
<script src="/bin/iot/libraries/js-classes/Utility.js?time=<?php echo time() ?>"></script>
<script>
    let collapsed           = false;
    let multipleClick       =  false;
    let portalUrl           = '/bin/iot/datacapture/';
    let usertype            = '<?php echo $usertype; ?>';
    let dataCapture         = new DataCapture();
    let render              = new Render();
    let actions             = new Actions();
    let buttonAction        = new ButtonAction();
    let links               = new Links();
    let message             = new Message();
    let elements            = new Elements();
    let utility             = new Utility();
    let tenantId            = document.querySelector('meta[name=cid]').content;
    let multiclick          = false;
    let baseUrl             = "/bin/mqtt/api/v1/";
    let sessionUser         = "<?php echo($_SESSION['username']) ?>";
    let sessionUserIp       = "<?php echo $_SERVER['REMOTE_ADDR'] ?>";
    let sessionUserFullname = "<?php echo($_SESSION['useraccessfirstname']." ".$_SESSION['useraccesslastname']) ?>";
    sessionStorage.setItem("returnUrl","nav-share-tab");
    let apiUrl              = '/bin/mqtt/api/v1/classes/Devicelist.php';
    let complianceAPI      = "/api/v1/compliance/";
    let masterDataAPI      = "/api/v1/masterdata/";
    let trackerMenu         = false;
</script>
</body>
</html>

